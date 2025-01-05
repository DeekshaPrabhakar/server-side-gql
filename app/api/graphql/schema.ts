const schema = `#graphql

    enum COLORS {
        RED
        GREEN
        BLUE
    }

    type Animal {
        species: String!
        name: String!
    }

    type Person {
        name: String!
        id: ID!
        faveColor: COLORS!
        pets: [Animal]!
    }

    union SearchType = Animal | Person

    type Query {
        me: String
        people: [Person]
        search: [SearchType]
    }
    
`

export default schema
