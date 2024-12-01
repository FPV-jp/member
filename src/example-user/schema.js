import { gql } from '@apollo/client'

const USER_QUERY = gql`
  query UserQuery($id: ID!) {
    user(id: $id) {
      id
      email
      registered_at
    }
  }
`

const USERS_QUERY = gql`
  query UsersQuery {
    users {
      id
      email
      registered_at
    }
  }
`

const CREATE_USER_MUTATION = gql`
  mutation CreateUserMutation($user: CreateUserInput!) {
    createUser(user: $user) {
      id
      email
      registered_at
    }
  }
`

const UPDATE_USER_MUTATION = gql`
  mutation UpdateUserMutation($user: UpdateUserInput!) {
    updateUser(user: $user) {
      id
      email
      registered_at
    }
  }
`

const DELETE_USER_MUTATION = gql`
  mutation DeleteUserMutation($id: ID!) {
    deleteUser(id: $id) {
      id
      email
      registered_at
    }
  }
`

export { USER_QUERY, USERS_QUERY, CREATE_USER_MUTATION, UPDATE_USER_MUTATION, DELETE_USER_MUTATION }
