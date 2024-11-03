import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password){
            token
            user{
                _id
                username
                email
            }
        }
    }
`;

export const ADD_USER = gql`
    mutation addUser($input: UserInput){
        addUser(input: $input){
            token
            user{
                _id
                username
                email
            }
        }
    }
`;

export const SAVE_BOOK = gql`
    mutation saveBook($input: BookInput){
        saveBook(input: $input){
            _id
            username
            email
            savedBooks{
                bookId
                authors
                description
                title
                image
                link
            }
        }
    }
`;

export const REMOVE_BOOK = gql`
    mutation removeBook($input: BookInput){
        removeBook(input: $input){
            _id
            username
            email
            savedBooks{
                bookId
                authors
                description
                title
                image
                link
            }
        }
    }
`;