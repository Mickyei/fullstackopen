const User = require('../models/user')

const dummy = (blogs) => {


    return 1
}

const totalLikes = (blogs) => {

    const reducer = (sum, item) => {
        return sum + item.likes
    }

    return blogs.length === 0
        ? 0
        : blogs.reduce(reducer, 0)

}

const favoriteBlog = (blogs) => {

    const reducer = (biggest, current) => {
        return (biggest.likes > current.likes) ? biggest : current
    }

    return blogs.length === 0
        ? {}
        : blogs.reduce(reducer)
}

const mostBlogs = (blogs) => {

    const unique = [...new Set(blogs.map(item => item.author))]

    let result = []
    for (let index = 0; index < unique.length; index++) {
        const element = unique[index]

        count = blogs.filter(item => item.author == element).length
        result.push({ name: element, blogs: count })

    }
   
    return result.reduce((prev, current) => (prev.blogs > current.blogs) ? prev : current)
}

const mostLikes = (blogs) => {

    let result = []
    const unique = [...new Set(blogs.map(item => item.author))]

    for (let index = 0; index < unique.length; index++) {
        const element = unique[index]

        personalBlogs = blogs.filter(item => item.author == element)

        let count = personalBlogs.reduce(function (prev, cur) {
            return prev + cur.likes;
        }, 0);

        result.push({ name: element, likes: count })
        
    }
    console.log(result)

    return result.reduce((prev, current) => (prev.likes > current.likes) ? prev : current)
}




const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
    usersInDb
}