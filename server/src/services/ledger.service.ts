import crypto from 'crypto';
import prisma from '../lib/prisma';

interface EventDataPayload {
    projectId: string;
    eventType: string;
    data: any;
    timestamp: string;
    actorId: string;
}

export class LedgerService {
    private static genesisHash = '0000000000000000000000000000000000000000000000000000000000000000';

    static calculateHash(payload: EventDataPayload, previousHash: string): string {
        // Stringify deterministically if possible, but for MVP JSON.stringify is fine
        // provided we verify using the EXACT string stored in DB `eventData` if that's what we hash.
        // Here we are hashing the *components*.
        const payloadString = JSON.stringify(payload) + previousHash;
        return crypto.createHash('sha256').update(payloadString).digest('hex');
    }

    static async createEvent(projectId: string, eventType: string, data: any, actorId: string) {
        // 1. Get last event for previous hash
        const lastEvent = await prisma.eventLedger.findFirst({
            where: { projectId },
            orderBy: { createdAt: 'desc' }
        });

        const previousHash = lastEvent ? lastEvent.currentHash : this.genesisHash;
        const timestamp = new Date().toISOString();

        // 2. Prepare payload for hashing
        const payload: EventDataPayload = {
            projectId,
            eventType,
            data,
            timestamp,
            actorId
        };

        const currentHash = this.calculateHash(payload, previousHash);

        // 3. Store in DB
        // We store the exact `data` and ensure we can reconstruct `payload` later.
        // Ideally we'd store the specific `timestamp` string too.
        // Let's store `timestamp` inside the JSON string to ensure we get the exact same string back.
        const dbData = JSON.stringify({ ...data, _ledger_timestamp: timestamp });

        const event = await prisma.eventLedger.create({
            data: {
                projectId,
                eventType,
                eventData: dbData, // Storing 'data' + timestamp
                previousHash,
                currentHash,
                createdBy: actorId,
                createdAt: timestamp // timestamp is ISO string, Prisma accepts it for DateTime field
            }
        });

        return event;
    }

    static async getTimeline(projectId: string) {
        const events = await prisma.eventLedger.findMany({
            where: { projectId },
            orderBy: { createdAt: 'desc' },
            include: { creator: true } // Include actor details
        });

        return events.map((e: any) => {
            // Parse data to return clean object
            let parsedData = {};
            try {
                parsedData = JSON.parse(e.eventData);
            } catch (err) { }

            return {
                ...e,
                data: parsedData
            };
        });
    }

    static async verifyIntegrity(projectId: string): Promise<{ valid: boolean; brokenAt?: string }> {
        const events = await prisma.eventLedger.findMany({
            where: { projectId },
            orderBy: { createdAt: 'asc' }
        });

        if (events.length === 0) return { valid: true };

        for (let i = 0; i < events.length; i++) {
            const event = events[i];
            const previousHash = i === 0 ? this.genesisHash : events[i - 1].currentHash;

            if (event.previousHash !== previousHash) {
                return { valid: false, brokenAt: event.id };
            }

            // Reconstruct payload
            let parsedData: any = {};
            try {
                parsedData = JSON.parse(event.eventData);
            } catch (e) { }

            // Extract the timestamp we stored
            const timestamp = parsedData._ledger_timestamp || event.createdAt.toISOString();

            // Remove our internal timestamp property to get back original 'data' for hashing
            // Wait, calculateHash used the object passed to it.
            // In createEvent: payload.data was just `data`. 
            // The stored `eventData` became `{...data, _ledger_timestamp}`.
            // So we need to separate them.
            const { _ledger_timestamp, ...originalData } = parsedData;

            const payload: EventDataPayload = {
                projectId: event.projectId,
                eventType: event.eventType,
                data: originalData,
                timestamp: timestamp, // Use the stored string exact
                actorId: event.createdBy
            };

            const calculatedHash = this.calculateHash(payload, previousHash);

            if (calculatedHash !== event.currentHash) {
                console.error(`Hash mismatch at ${event.id}: Calc ${calculatedHash} vs Stored ${event.currentHash}`);
                return { valid: false, brokenAt: event.id };
            }
        }

        return { valid: true };
    }
}
