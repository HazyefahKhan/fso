const dummy = (blogs) => {
    return 1
  }
  
const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)
}
const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    return blogs.reduce((favorite, current) => {
        return (current.likes > favorite.likes) ? current : favorite
    })
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    // Count blogs per author using Map for efficient lookups
    const blogCounts = blogs.reduce((counts, blog) => {
        const author = blog.author
        counts.set(author, (counts.get(author) || 0) + 1)
        return counts
    }, new Map())

    // Find author with maximum blog count
    let maxAuthor = null
    let maxCount = 0

    for (const [author, count] of blogCounts.entries()) {
        if (count > maxCount) {
            maxCount = count
            maxAuthor = author
        }
    }

    return {
        author: maxAuthor,
        blogs: maxCount
    }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    // Accumulate total likes per author using Map for efficient lookups
    const likesByAuthor = blogs.reduce((likesMap, blog) => {
        const author = blog.author
        const currentLikes = likesMap.get(author) || 0
        likesMap.set(author, currentLikes + (blog.likes || 0))
        return likesMap
    }, new Map())

    // Find author with maximum total likes
    let maxAuthor = null
    let maxLikes = 0

    for (const [author, likes] of likesByAuthor.entries()) {
        if (likes > maxLikes) {
            maxLikes = likes
            maxAuthor = author
        }
    }

    return {
        author: maxAuthor,
        likes: maxLikes
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}