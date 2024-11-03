import User from '../models/User.js'
import { signToken, AuthenticationError } from '../services/auth.js';

interface User {
    _id: string;
    username: string;
    email: string;
    bookCount: number;
    savedBooks: Book[];
}

interface Book {
    bookId: string;
    authors: string[];
    description: string;
    title: string;
    image: string;
    link: string;
}

interface AddUserArgs {
    input: {
        username: string;
        email: string;
        password: string;
    }
}

interface AddBookArgs {
    userId: string;
    book: Book;
}

interface RemoveBookArgs {
    userId: string;
    book: Book;
}

interface Context {
    user: User;
}

const resolvers = {
    Query: {
        me: async (_parent: any, _args: any, context: Context): Promise<User | null> => {
            if (context.user){
                return await User.findOne({ _id: context.user._id });
            }
            throw AuthenticationError;
        }
    },
    Mutations: {
        login: async (_parent: any, { email, password }: { email: string, password: string }): Promise<{ token: string; user: User }> =>{
            const user = await User.findOne({ email });
            if (!user){
                throw AuthenticationError;
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw){
                throw AuthenticationError;
            }
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },
        addUser: async (_parent: any, { input }: AddUserArgs): Promise<{ token: string; user: User }> => {
            const user = await User.create({ input });
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },
        saveBook: async (_parent: any, { userId, book }: AddBookArgs, context: Context): Promise<User | null> => {
            if (context.user){
                return await User.findOneAndUpdate(
                    { _id: userId },
                    { $addToSet: { savedBooks: book } },
                    { new: true, runValidators: true }
                );
            };
            throw AuthenticationError;
        },
        removeBook: async (_parent: any, { book }: RemoveBookArgs, context: Context): Promise<User | null> => {
            if (context.user){
                return await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: book.bookId } } },
                    { new: true }
                );
            };
            throw AuthenticationError;
        },
    },
};

export default resolvers;