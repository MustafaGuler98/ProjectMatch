import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    console.log('Bounding database seeding...');

    const campaignsPath = path.join(process.cwd(), 'prisma', 'data', 'campaigns.json');
    const creatorsPath = path.join(process.cwd(), 'prisma', 'data', 'creators.json');

    const campaignsDataRaw = await fs.readFile(campaignsPath, 'utf8');
    const creatorsDataRaw = await fs.readFile(creatorsPath, 'utf8');

    const campaigns = JSON.parse(campaignsDataRaw);
    const creators = JSON.parse(creatorsDataRaw);

    // Campaigns
    console.log(`Processing ${campaigns.length} campaigns...`);
    for (const cmp of campaigns) {
        const campaignPayload = {
            brand: cmp.brand,
            objective: cmp.objective,
            targetCountry: cmp.targetCountry,
            targetGender: cmp.targetGender,
            targetAgeRange: cmp.targetAgeRange,
            niches: cmp.niches,
            preferredHookTypes: cmp.preferredHookTypes,
            minAvgWatchTime: cmp.minAvgWatchTime,
            tone: cmp.tone,
            doNotUseWords: cmp.doNotUseWords,
            // Flatten 
            minFollowers: cmp.budgetRange.minFollowers,
            maxFollowers: cmp.budgetRange.maxFollowers,
        };

        await prisma.campaign.upsert({
            where: { id: cmp.id },
            update: campaignPayload,
            create: {
                id: cmp.id,
                ...campaignPayload,
            },
        });
    }

    // Creators
    console.log(`Processing ${creators.length} creators...`);
    for (const cr of creators) {
        const creatorPayload = {
            username: cr.username,
            country: cr.country,
            niches: cr.niches,
            followers: cr.followers,
            engagementRate: cr.engagementRate,
            avgWatchTime: cr.avgWatchTime,
            contentStyle: cr.contentStyle,
            primaryHookType: cr.primaryHookType,
            brandSafetyFlags: cr.brandSafetyFlags,
            // Normalized
            audienceCountries: cr.audience.topCountries,
            audienceFemale: cr.audience.genderSplit.female,
            audienceMale: cr.audience.genderSplit.male,
            audienceAgeRange: cr.audience.topAgeRange,
        };

        const postsPayload = cr.lastPosts.map((post: any) => ({
            caption: post.caption,
            views: post.views,
            likes: post.likes,
        }));

        await prisma.creator.upsert({
            where: { id: cr.id },
            update: {
                ...creatorPayload,
                // Idempotent relation update
                posts: {
                    deleteMany: {},
                    create: postsPayload,
                },
            },
            create: {
                id: cr.id,
                ...creatorPayload,
                posts: {
                    create: postsPayload,
                },
            },
        });
    }

    console.log('Database seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('Error during database seeding:');
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
