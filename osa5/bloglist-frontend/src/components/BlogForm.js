import React, {useState} from 'react' 

const BlogForm = ({ createNote }) => {
  const [url, setUrl] = useState('')
  const [author, setAuthor] = useState('')
  const [title, setTitle] = useState('')

  const addNote = (event) => {
    event.preventDefault()

    createNote({title: title, author: author, url: url})
    setAuthor('')
    setTitle('')
    setUrl('')
  }

  return (
    <div>
      <form onSubmit={addNote}>
      <h2>New blog</h2>
      <div>
        title
          <input
          type="text"
          value={title}
          name="Username"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author
          <input
          type="text"
          value={author}
          name="author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>

      <div>
        url
          <input
          type="text"
          value={url}
          name="url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">Add blog</button>
    </form>      
    </div>
  )
}

export default BlogForm