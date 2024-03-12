const prisma = require('../../database/database');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');


const resolvers = {

    Query: {

        // Example of a resolver that requires authentication
        // privateData: (parent, args, context) => {
        //     if(!context, user) throw new Error('Not authenticated');
        //     // Proceed with fetching the data knowing the user is authenticated

        //     return "Sensitive data only for authenticated users"
        // },

        user: async (_, { id }) => await prisma.user.findUnique({
            where: { id: parseInt(id) },
            include: {
                schedules: true,
            }
        }),
        users: async () => await prisma.user.findMany({
            include: {
                schedules: true,
            }
        }),

        schedules: async () => await prisma.schedule.findMany(),

        week: async (_, { id }) => {
            const schedule = await prisma.schedule.findUnique({
                where: { id: parseInt(id) },
                select: { week: true }
            });

            if(!schedule) {
                throw new Error(`Schedule with id ${id} not found.`)
            }

            return schedule.week;
        }
    },

    Mutation: {

        updateWeek: async (_, { id, week, userId }) => {

            const scheduleWeek = await prisma.schedule.update({
                where: { id: parseInt(id), userId: parseInt(userId) },
                data: { week }
            });

            return {
                week
            }
        },

        register: async (_, { email, password }) => {

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await prisma.user.create({
                data: { email, password: hashedPassword },
            });

            return {
                accessToken: generateAccessToken(user),
                refreshToken: generateRefreshToken(user),
                user,
            };
        },

        login: async (_, { email, password }) => {
            const user = await prisma.user.findUnique({
                where: { email }
            });

            if (!user || !(await bcrypt.compare(password, user.password))) {
                throw new Error('invalid credentials');
            }
            return {
                accessToken: generateAccessToken(user),
                refreshToken: generateRefreshToken(user),
                user,
            };
        },

        refreshToken: async (_, { token }) => {
            try {

                const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

                const user = await prisma.user.findUnique({
                    where: { id: decoded.userId }
                });

                if (!user) {
                    throw new Error('User not found')
                }

                return {
                    accessToken: generateAccessToken(user),
                    refreshToken: generateRefreshToken(user),
                    user,
                };
            } catch (err) {
                throw new Error('Invalid or expired refresh token')
            }
        },
    }
};

function generateAccessToken(user) {
    return jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}
function generateRefreshToken(user) {
    return jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

module.exports = resolvers;