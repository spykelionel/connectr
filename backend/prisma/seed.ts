import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Enhanced sample data with more variety
const sampleNames = [
  'Alex Johnson',
  'Sarah Chen',
  'Michael Rodriguez',
  'Emily Davis',
  'David Kim',
  'Jessica Wang',
  'Ryan Thompson',
  'Lisa Anderson',
  'James Wilson',
  'Maria Garcia',
  'Kevin Brown',
  'Amanda Taylor',
  'Chris Martinez',
  'Rachel Lee',
  'Daniel White',
  'Nicole Jackson',
  'Brandon Harris',
  'Stephanie Clark',
  'Tyler Lewis',
  'Ashley Walker',
  'Jordan Hall',
  'Samantha Young',
  'Matthew Allen',
  'Lauren King',
  'Andrew Wright',
  'Megan Lopez',
  'Justin Hill',
  'Kayla Scott',
  'Nathan Green',
  'Olivia Adams',
  'Caleb Baker',
  'Hannah Nelson',
  'Zachary Carter',
  'Grace Mitchell',
  'Ethan Perez',
  'Chloe Roberts',
  'Lucas Turner',
  'Sophia Phillips',
  'Noah Campbell',
  'Isabella Parker',
  'Mason Evans',
  'Ava Edwards',
  'Logan Collins',
  'Mia Stewart',
  'Jackson Sanchez',
  'Charlotte Morris',
  'Sebastian Rogers',
  'Amelia Reed',
  'Henry Cook',
  'Harper Morgan',
  'Benjamin Bailey',
  'Ella Rivera',
  'Gabriel Cooper',
  'Lily Richardson',
  'Owen Ward',
  'Zoe Torres',
  'Carter Peterson',
  'Aria Gray',
  'Wyatt Ramirez',
  'Nora James',
  'Hunter Watson',
  'Maya Brooks',
  'Connor Kelly',
  'Penelope Sanders',
  'Eli Price',
  'Violet Bennett',
  'Jack Wood',
  'Luna Barnes',
  'Luke Ross',
  'Hazel Murphy',
];

const sampleEmails = sampleNames.map(
  (name) => `${name.toLowerCase().replace(' ', '.')}@email.com`,
);

const sampleContacts = Array.from(
  { length: 30 },
  (_, i) => `+1-555-${String(i + 1000).padStart(4, '0')}`,
);

const genders = ['male', 'female', 'other'];

const networkData = [
  {
    name: 'Tech Innovators',
    description:
      'A community for technology enthusiasts, developers, and innovators sharing the latest trends and breakthroughs in tech.',
    category: 'Technology',
  },
  {
    name: 'Creative Minds',
    description:
      'Join artists, designers, writers, and creative professionals to share inspiration, collaborate, and showcase your work.',
    category: 'Creative',
  },
  {
    name: 'Business Leaders',
    description:
      'Network with entrepreneurs, executives, and business professionals to discuss strategies, opportunities, and industry insights.',
    category: 'Business',
  },
  {
    name: 'Science & Research',
    description:
      'Connect with scientists, researchers, and academics to share discoveries, collaborate on projects, and discuss scientific breakthroughs.',
    category: 'Science',
  },
  {
    name: 'Sports & Fitness',
    description:
      'A community for athletes, fitness enthusiasts, and sports fans to share training tips, achievements, and healthy lifestyle advice.',
    category: 'Sports',
  },
  {
    name: 'Music & Entertainment',
    description:
      'Join musicians, artists, and entertainment professionals to collaborate, share music, and discuss the latest in entertainment.',
    category: 'Entertainment',
  },
  {
    name: 'Education & Learning',
    description:
      'Connect with educators, students, and lifelong learners to share knowledge, resources, and educational opportunities.',
    category: 'Education',
  },
  {
    name: 'Health & Wellness',
    description:
      'A supportive community focused on mental health, physical wellness, and holistic approaches to living a healthy life.',
    category: 'Health',
  },
  {
    name: 'Environmental Action',
    description:
      'Join environmentalists, sustainability advocates, and eco-conscious individuals working towards a greener future.',
    category: 'Environment',
  },
  {
    name: 'Food & Cooking',
    description:
      'Share recipes, cooking tips, and culinary experiences with fellow food lovers and professional chefs.',
    category: 'Food',
  },
  {
    name: 'Gaming Community',
    description:
      'Connect with gamers, developers, and gaming enthusiasts to discuss games, share strategies, and organize gaming sessions.',
    category: 'Gaming',
  },
  {
    name: 'Photography Hub',
    description:
      'A space for photographers of all levels to share their work, get feedback, and learn new techniques.',
    category: 'Photography',
  },
];

const postContent = [
  'Just finished an amazing project! The team collaboration was incredible. 🚀',
  "Excited to share some insights from today's conference. The future of tech looks bright!",
  "Working on something new and innovative. Can't wait to show you all! 💡",
  'Had an incredible networking event today. Met so many inspiring people!',
  'Just published my latest article. Would love to hear your thoughts! 📝',
  'The sunrise this morning was absolutely breathtaking. Nature never fails to amaze me.',
  'Coffee and coding - the perfect combination for a productive day! ☕',
  'Just completed a challenging workout. Feeling stronger every day! 💪',
  "Reading an amazing book that's completely changing my perspective on life.",
  'Collaborated with some brilliant minds today. Innovation happens when we work together!',
  'Just tried a new recipe and it turned out amazing! Cooking is such a creative outlet.',
  'Attended an incredible workshop today. Learning never stops! 📚',
  'The sunset view from my office window is absolutely stunning today.',
  'Just finished a marathon coding session. The satisfaction of solving complex problems is unmatched!',
  'Had an inspiring conversation with a mentor today. Grateful for the guidance!',
  'Working on a passion project that combines my love for art and technology.',
  "Just discovered a new podcast that's absolutely mind-blowing. Highly recommend!",
  'The power of community never ceases to amaze me. Together we achieve more!',
  'Just completed a challenging hike. The view from the top was worth every step!',
  "Excited to announce that I'll be speaking at an upcoming conference!",
  'Just launched my startup! The journey has been incredible so far. 🎉',
  'Attended a virtual meetup today. The future of remote collaboration is exciting!',
  "Working on a side project that I'm really passionate about. Can't wait to share!",
  'Just finished reading an incredible book. Highly recommend it to everyone!',
  'The creativity in this community never ceases to amaze me. Keep inspiring!',
  'Just completed a certification course. Always learning, always growing! 📖',
  'Had an amazing brainstorming session today. Great ideas are born from collaboration!',
  'Just tried a new productivity technique. Game changer! ⚡',
  'The support from this community has been incredible. Thank you all!',
  'Just finished a creative project. The process was as rewarding as the result!',
];

const commentContent = [
  'This is amazing! Great work! 👏',
  'I completely agree with your perspective on this.',
  'Thanks for sharing this valuable insight!',
  'This is exactly what I needed to hear today.',
  'Incredible work! Keep it up! 🚀',
  "I've been thinking about this too. Great minds think alike!",
  'This is so inspiring! Thank you for sharing.',
  'I love how you explained this. Very clear and insightful.',
  'This reminds me of a similar experience I had.',
  "Great point! I hadn't considered that angle before.",
  "This is fantastic! Can't wait to see what's next.",
  "You're absolutely right about this. Well said!",
  'This is such a valuable resource. Thank you!',
  "I'm excited to try this approach myself.",
  'This is exactly the kind of content I love to see!',
  'Amazing work! This is really impressive.',
  "I've learned so much from this post. Thank you!",
  'This is a great perspective. I appreciate you sharing.',
  "I'm definitely going to implement this idea.",
  'This is so well thought out. Excellent work!',
  "Couldn't agree more! This is spot on.",
  'This is exactly what I was looking for. Thank you!',
  "I'm going to share this with my team. Great insights!",
  'This is such a helpful resource. Bookmarking this!',
  'I love the way you break this down. Very educational!',
  'This is inspiring me to try something new. Thank you!',
  'Great example! This really illustrates the point well.',
  "I'm excited to see where this leads. Keep us posted!",
  'This is a game-changer! Thank you for sharing.',
  "I'm going to implement this right away. Great advice!",
];

// Helper function to get random date within last 30 days
function getRandomDate() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  return new Date(
    thirtyDaysAgo.getTime() +
      Math.random() * (now.getTime() - thirtyDaysAgo.getTime()),
  );
}

// Helper function to get random date within last 7 days
function getRecentDate() {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return new Date(
    sevenDaysAgo.getTime() +
      Math.random() * (now.getTime() - sevenDaysAgo.getTime()),
  );
}

async function main() {
  console.log('🌱 Starting comprehensive database seeding...');

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await prisma.commentReaction.deleteMany();
  await prisma.postDownvote.deleteMany();
  await prisma.postUpvote.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.networkAdministration.deleteMany();
  await prisma.networkMembership.deleteMany();
  await prisma.userConnection.deleteMany();
  await prisma.network.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  // Create roles
  console.log('👥 Creating roles...');
  const adminRole = await prisma.role.create({
    data: {
      name: 'admin',
      description: 'Administrator role with full access',
    },
  });

  const userRole = await prisma.role.create({
    data: {
      name: 'user',
      description: 'Regular user role',
    },
  });

  const moderatorRole = await prisma.role.create({
    data: {
      name: 'moderator',
      description: 'Moderator role with limited admin privileges',
    },
  });

  // Create users with realistic timestamps
  console.log('👤 Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  const users = [];

  for (let i = 0; i < sampleNames.length; i++) {
    const createdAt = getRandomDate();
    const user = await prisma.user.create({
      data: {
        name: sampleNames[i],
        email: sampleEmails[i],
        contact: sampleContacts[i % sampleContacts.length],
        gender: genders[i % genders.length],
        password: hashedPassword,
        isAdmin: i === 0, // First user is admin
        roleId: i === 0 ? adminRole.id : i < 5 ? moderatorRole.id : userRole.id,
        profileurl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${sampleNames[i]}`,
        createdAt,
        updatedAt: createdAt,
      },
    });
    users.push(user);
  }

  // Create networks with realistic timestamps
  console.log('🌐 Creating networks...');
  const networks = [];
  for (let i = 0; i < networkData.length; i++) {
    const createdAt = getRandomDate();
    const network = await prisma.network.create({
      data: {
        name: networkData[i].name,
        description: networkData[i].description,
        avatar: `https://api.dicebear.com/7.x/shapes/svg?seed=${networkData[i].name}`,
        createdAt,
        updatedAt: createdAt,
      },
    });
    networks.push(network);
  }

  // Create network memberships and administrations
  console.log('🔗 Creating network memberships...');
  for (let i = 0; i < networks.length; i++) {
    const network = networks[i];
    const creator = users[i % users.length];

    // Creator becomes admin
    await prisma.networkAdministration.create({
      data: {
        userId: creator.id,
        networkId: network.id,
        role: 'admin',
        assignedAt: network.createdAt,
      },
    });

    // Add random members to each network (5-15 members)
    const memberCount = Math.floor(Math.random() * 11) + 5;
    const shuffledUsers = [...users].sort(() => 0.5 - Math.random());

    for (let j = 0; j < memberCount && j < shuffledUsers.length; j++) {
      const member = shuffledUsers[j];
      if (member.id !== creator.id) {
        const joinedAt = new Date(
          network.createdAt.getTime() +
            Math.random() * (Date.now() - network.createdAt.getTime()),
        );
        await prisma.networkMembership.create({
          data: {
            userId: member.id,
            networkId: network.id,
            joinedAt,
          },
        });
      }
    }
  }

  // Create user connections with realistic timestamps
  console.log('🤝 Creating user connections...');
  const connectionCount = Math.floor(users.length * 0.4); // 40% of users have connections

  for (let i = 0; i < connectionCount; i++) {
    const user1 = users[Math.floor(Math.random() * users.length)];
    const user2 = users[Math.floor(Math.random() * users.length)];

    if (user1.id !== user2.id) {
      const statuses = ['accepted', 'pending'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const createdAt = getRandomDate();

      try {
        await prisma.userConnection.create({
          data: {
            userId: user1.id,
            friendId: user2.id,
            status: status,
            createdAt,
            updatedAt: createdAt,
          },
        });
      } catch (error) {
        // Skip if connection already exists
      }
    }
  }

  // Create posts with realistic timestamps
  console.log('📝 Creating posts...');
  const posts = [];
  const postCount = 80;

  for (let i = 0; i < postCount; i++) {
    const author = users[Math.floor(Math.random() * users.length)];
    const network =
      Math.random() > 0.3
        ? networks[Math.floor(Math.random() * networks.length)]
        : null;
    const content = postContent[Math.floor(Math.random() * postContent.length)];
    const createdAt = getRandomDate();

    const post = await prisma.post.create({
      data: {
        body: content,
        userId: author.id,
        networkId: network?.id,
        attachment:
          Math.random() > 0.7
            ? `https://picsum.photos/800/600?random=${i}`
            : null,
        createdAt,
        updatedAt: createdAt,
      },
    });
    posts.push(post);
  }

  // Create comments with realistic timestamps
  console.log('💬 Creating comments...');
  const commentCount = 200;

  for (let i = 0; i < commentCount; i++) {
    const post = posts[Math.floor(Math.random() * posts.length)];
    const author = users[Math.floor(Math.random() * users.length)];
    const content =
      commentContent[Math.floor(Math.random() * commentContent.length)];
    const createdAt = new Date(
      post.createdAt.getTime() +
        Math.random() * (Date.now() - post.createdAt.getTime()),
    );

    await prisma.comment.create({
      data: {
        body: content,
        postId: post.id,
        userId: author.id,
        attachment:
          Math.random() > 0.95
            ? `https://picsum.photos/400/300?random=${i}`
            : null,
        createdAt,
        updatedAt: createdAt,
      },
    });
  }

  // Create post reactions with realistic timestamps
  console.log('👍 Creating post reactions...');
  for (const post of posts) {
    const reactionCount = Math.floor(Math.random() * 15) + 2; // 2-16 reactions per post

    for (let i = 0; i < reactionCount; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const isUpvote = Math.random() > 0.15; // 85% upvotes, 15% downvotes
      const createdAt = new Date(
        post.createdAt.getTime() +
          Math.random() * (Date.now() - post.createdAt.getTime()),
      );

      try {
        if (isUpvote) {
          await prisma.postUpvote.create({
            data: {
              userId: user.id,
              postId: post.id,
              createdAt,
            },
          });
        } else {
          await prisma.postDownvote.create({
            data: {
              userId: user.id,
              postId: post.id,
              createdAt,
            },
          });
        }
      } catch (error) {
        // Skip if reaction already exists
      }
    }
  }

  // Create comment reactions
  console.log('❤️ Creating comment reactions...');
  const comments = await prisma.comment.findMany();
  for (const comment of comments) {
    const reactionCount = Math.floor(Math.random() * 8) + 1; // 1-8 reactions per comment

    for (let i = 0; i < reactionCount; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const createdAt = new Date(
        comment.createdAt.getTime() +
          Math.random() * (Date.now() - comment.createdAt.getTime()),
      );

      try {
        await prisma.commentReaction.create({
          data: {
            userId: user.id,
            commentId: comment.id,
            type: 'like',
            createdAt,
          },
        });
      } catch (error) {
        // Skip if reaction already exists
      }
    }
  }

  console.log('✅ Comprehensive database seeding completed successfully!');
  console.log(`📊 Created:`);
  console.log(
    `   - ${users.length} users (1 admin, 4 moderators, ${users.length - 5} regular users)`,
  );
  console.log(`   - ${networks.length} networks across different categories`);
  console.log(`   - ${posts.length} posts with realistic timestamps`);
  console.log(`   - ${commentCount} comments`);
  console.log(`   - Multiple network memberships and administrations`);
  console.log(`   - User connections and post/comment reactions`);
  console.log(
    `   - All data with realistic timestamps spanning the last 30 days`,
  );
  console.log('');
  console.log('🔑 Default login credentials:');
  console.log('   Email: alex.johnson@email.com');
  console.log('   Password: password123');
  console.log('');
  console.log('🎉 Your platform is now populated with realistic data!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
