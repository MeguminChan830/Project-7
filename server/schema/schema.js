const Project = require("../models/Project")
const Client= require("../models/Client")

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLSchema,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLEnumType
}= require('graphql')
const ProjectType= new GraphQLObjectType({
    name: 'Project',
    fields:{
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        desc: {type: GraphQLString},
        status: {type: GraphQLString},
        client: {
            type: ClientType,
            resolve(parent, args){
                return Client.findById(parent.clientId)
            }
        }
    }
})

const ClientType= new GraphQLType({
    name: 'Client',
    fields:{
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        phone: {type: GraphQLString}
    }
})

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        projects:{
            type :new GraphQLList(ProjectType),
            resolve (parent, args){
                return Project.find()
            }
        },
        project:{
            type: ProjectType,
            args:{id: {type: GraphQLID}},
            resolve(parent, args){
                return Project.findById(args.id)
            }
        },
        clients: {
            type: new GraphQLList(ClientType),
            resolve(parent, args){
                return Client.find()
            }
        },
        client:{
            type: ClientType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                return Client.findById(args.id)
            }
        }
    }
})
const mutation= new GraphQLType({
    name: "Mutation",
    fields: {
        addClient:{
            type: ClientType,
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                email: {type: GraphQLNonNull(GraphQLString)},
                phone: {type: GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                const client = new Client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone
                })
                return client.save()
            }
        },
        deleteClient:{
            type: ClientType,
            args: {
                id: {type:GraphQLID}
            },
            resolve(parent, args){
                Project.find({clientId:args.id}).then((projects)=>{
                    projects.forEach(project=>{
                        project.deleteOne();
                    })
                })
                return Client.findByIdAndRemove(args.id)
            }
        },
        addProjects:{
            type: ProjectType,
            args: {
                name: {type: GraphQLString},
                desc: {type: GraphQLString},
                status: {
                    type: new GraphQLEnumType({
                        name: "ProjectStatus",
                        values: {
                            new: {value: "Not Started"},
                            progess: {value: "In Progess"},
                            completed: {value: "Completed"}
                        }
                    }),
                    defaultValue: "Not Started"
                },
                resolve(parent, args){
                    const project= new Project({
                        name: args.name,
                        desc: args.desc,
                        status: args.status,
                        clientId: args.clientId
                    })
                    return project.save()
                }
            }
        },
        deleteProject:{
            type: ProjectType,
            args:{
                id: {type: GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                return Project.findByAdAndRemove(args.id)
            }
        },
        updateProject:{
            type: ProjectType,
            args: {
                id: {type: GraphQLNonNull(GraphQLID)},
                name: {type: GraphQLString},
                desc: {type: GraphQLString},
                status: {
                    type: new GraphQLEnumType({
                        name: "ProjectStatusUpdate",
                        values: {
                            new:{value: "Not Started"},
                            progress: {value: "In Progress"},
                            completed: {value: "Completed"}
                        }
                    })
                },
                resolve(parent, args){
                    return Project.findByIdAndUpdate(
                        args.id,
                        {
                            $set:{
                                name: args.name,
                                desc: args.desc,
                                status: args.status
                            },
                        },
                        {new: true}
                    )
                }
            }
        }
    }
})
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})

