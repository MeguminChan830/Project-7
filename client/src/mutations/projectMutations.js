import {gql} from "@apollo/client"
const ADD_PROJECT =gql`
mutation AddProject(
    $name: String!,
    $desc: String!,
    $status: ProjectStatus!,
    $clientId:  ID!
){
    addProject(
        name: $name,
        desc: $desc,
        status: $status,
        clientId: $clientId
    ){
        id
        name
        desc
        status
        client
        {
            id
            name
            email
            phone
        }
    }
}
`
const DELETE_PROJECT = gql`
mutation DeleteProject($id: ID!){
    deleteProject(id: $id){
        id
    }
}
`
const UPDATE_PROJECT= gql`
mutation UpdateProject(
    $id: ID!
    $name: String!
    $desc: String!
    $status: ProjectStatusUpdate!
){
    updateProject(
        id: $id
        name: $name
        desc: $desc
        status: $status
    ){
        id
        name
        desc
        status
        client{
            id
            name
            email
            phone
        }
    }
}
`

export {ADD_PROJECT, DELETE_PROJECT, UPDATE_PROJECT}