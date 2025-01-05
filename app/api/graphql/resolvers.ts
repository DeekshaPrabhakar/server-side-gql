const resolvers = {
  COLORS: {
    RED: '#f00',
    GREEN: '#0f0',
    BLUE: '#00f',
  },
  SearchType: {
    __resolveType(obj) {
      if (obj.species) {
        return 'Animal'
      }
      if (obj.name) {
        return 'Person'
      }
      return null
    },
  },
  Person: {
    name: (parent) => {
      return parent.name.toUpperCase()
    },
    pets: (parent) => {
      return parent.pets.map((id) => {
        return { species: 'Dog', name: 'Rex' }
      })
    },
  },
  Query: {
    search: () => {
      return [
        { species: 'Dog', name: 'Rex' },
        { species: 'Cat', name: 'Fluffy' },
        { id: 'Person', name: 'John Doe' },
      ]
    },
    me: () => {
      return 'Hello world!'
    },
    people: () => {
      return [
        { name: 'John Doe', id: 1, faveColor: 'RED', pets: [1, 2, 3] },
        { name: 'Jane Doe', id: 2, faveColor: 'GREEN', pets: [] },
        { name: 'John Smith', id: 3, faveColor: 'BLUE', pets: [] },
      ]
    },
  },
}

export default resolvers
