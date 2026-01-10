import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create sample users
  const user1 = await prisma.user.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      id: 'user-1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      image: 'https://ui-avatars.com/api/?name=John+Doe',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'jane.smith@example.com' },
    update: {},
    create: {
      id: 'user-2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      image: 'https://ui-avatars.com/api/?name=Jane+Smith',
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'mike.johnson@example.com' },
    update: {},
    create: {
      id: 'user-3',
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      image: 'https://ui-avatars.com/api/?name=Mike+Johnson',
    },
  });

  console.log('✅ Created users:', { user1: user1.name, user2: user2.name, user3: user3.name });

  // Create workspace
  const workspace = await prisma.workspace.upsert({
    where: { slug: 'acme-corp' },
    update: {},
    create: {
      id: 'workspace-1',
      name: 'Acme Corporation',
      slug: 'acme-corp',
      description: 'Main workspace for Acme Corporation',
      ownerId: user1.id,
      image_url: 'https://ui-avatars.com/api/?name=Acme+Corp',
    },
  });

  console.log('✅ Created workspace:', workspace.name);

  // Add workspace members
  await prisma.workspaceMember.upsert({
    where: {
      userId_workspaceId: {
        userId: user1.id,
        workspaceId: workspace.id,
      },
    },
    update: {},
    create: {
      userId: user1.id,
      workspaceId: workspace.id,
      role: 'ADMIN',
      message: 'Workspace owner',
    },
  });

  await prisma.workspaceMember.upsert({
    where: {
      userId_workspaceId: {
        userId: user2.id,
        workspaceId: workspace.id,
      },
    },
    update: {},
    create: {
      userId: user2.id,
      workspaceId: workspace.id,
      role: 'MEMBER',
      message: 'Welcome to the team!',
    },
  });

  await prisma.workspaceMember.upsert({
    where: {
      userId_workspaceId: {
        userId: user3.id,
        workspaceId: workspace.id,
      },
    },
    update: {},
    create: {
      userId: user3.id,
      workspaceId: workspace.id,
      role: 'MEMBER',
      message: 'Excited to join!',
    },
  });

  console.log('✅ Added workspace members');

  // Create projects
  const project1 = await prisma.project.create({
    data: {
      name: 'Website Redesign',
      description: 'Redesign the company website with modern UI/UX',
      priority: 'HIGH',
      status: 'ACTIVE',
      start_date: new Date('2024-01-01'),
      end_date: new Date('2024-06-30'),
      team_lead: user1.id,
      workspaceId: workspace.id,
      progress: 45,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'Mobile App Development',
      description: 'Build iOS and Android mobile applications',
      priority: 'MEDIUM',
      status: 'ACTIVE',
      start_date: new Date('2024-02-01'),
      end_date: new Date('2024-12-31'),
      team_lead: user2.id,
      workspaceId: workspace.id,
      progress: 20,
    },
  });

  const project3 = await prisma.project.create({
    data: {
      name: 'API Integration',
      description: 'Integrate third-party APIs for enhanced functionality',
      priority: 'LOW',
      status: 'PLANNING',
      start_date: new Date('2024-03-01'),
      end_date: new Date('2024-09-30'),
      team_lead: user3.id,
      workspaceId: workspace.id,
      progress: 10,
    },
  });

  console.log('✅ Created projects:', { project1: project1.name, project2: project2.name, project3: project3.name });

  // Add project members
  await prisma.projectMember.createMany({
    data: [
      { userId: user2.id, projectId: project1.id },
      { userId: user3.id, projectId: project1.id },
      { userId: user1.id, projectId: project2.id },
      { userId: user3.id, projectId: project2.id },
      { userId: user1.id, projectId: project3.id },
      { userId: user2.id, projectId: project3.id },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Added project members');

  // Create tasks
  const tasks = await prisma.task.createMany({
    data: [
      // Project 1 tasks
      {
        projectId: project1.id,
        title: 'Design homepage mockup',
        description: 'Create high-fidelity mockups for the new homepage',
        status: 'DONE',
        type: 'TASK',
        priority: 'HIGH',
        assigneeId: user2.id,
        due_date: new Date('2024-02-15'),
      },
      {
        projectId: project1.id,
        title: 'Implement responsive navigation',
        description: 'Build mobile-first responsive navigation menu',
        status: 'IN_PROGRESS',
        type: 'FEATURE',
        priority: 'HIGH',
        assigneeId: user3.id,
        due_date: new Date('2024-03-01'),
      },
      {
        projectId: project1.id,
        title: 'Fix mobile menu bug',
        description: 'Menu not closing on mobile devices',
        status: 'TODO',
        type: 'BUG',
        priority: 'MEDIUM',
        assigneeId: user1.id,
        due_date: new Date('2024-02-20'),
      },
      // Project 2 tasks
      {
        projectId: project2.id,
        title: 'Setup React Native project',
        description: 'Initialize React Native project with TypeScript',
        status: 'DONE',
        type: 'TASK',
        priority: 'HIGH',
        assigneeId: user2.id,
        due_date: new Date('2024-02-10'),
      },
      {
        projectId: project2.id,
        title: 'Implement authentication flow',
        description: 'Add login, signup, and password reset functionality',
        status: 'IN_PROGRESS',
        type: 'FEATURE',
        priority: 'HIGH',
        assigneeId: user1.id,
        due_date: new Date('2024-03-15'),
      },
      {
        projectId: project2.id,
        title: 'Create user profile screen',
        description: 'Design and implement user profile page',
        status: 'TODO',
        type: 'TASK',
        priority: 'MEDIUM',
        assigneeId: user3.id,
        due_date: new Date('2024-04-01'),
      },
      // Project 3 tasks
      {
        projectId: project3.id,
        title: 'Research payment APIs',
        description: 'Evaluate Stripe, PayPal, and Square APIs',
        status: 'IN_PROGRESS',
        type: 'TASK',
        priority: 'MEDIUM',
        assigneeId: user3.id,
        due_date: new Date('2024-03-20'),
      },
      {
        projectId: project3.id,
        title: 'Integrate weather API',
        description: 'Add weather data to dashboard',
        status: 'TODO',
        type: 'IMPROVEMENT',
        priority: 'LOW',
        assigneeId: user1.id,
        due_date: new Date('2024-05-01'),
      },
    ],
  });

  console.log(`✅ Created ${tasks.count} tasks`);

  // Create some comments
  const allTasks = await prisma.task.findMany({ take: 3 });
  
  await prisma.comment.createMany({
    data: [
      {
        content: 'Great work on this! The design looks amazing.',
        userId: user1.id,
        taskId: allTasks[0].id,
      },
      {
        content: 'I have some questions about the mobile breakpoints.',
        userId: user2.id,
        taskId: allTasks[0].id,
      },
      {
        content: 'Making good progress. Should be done by tomorrow.',
        userId: user3.id,
        taskId: allTasks[1].id,
      },
      {
        content: 'This is blocking other tasks. Let\'s prioritize it.',
        userId: user1.id,
        taskId: allTasks[2].id,
      },
    ],
  });

  console.log('✅ Created comments');

  console.log('\n🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
