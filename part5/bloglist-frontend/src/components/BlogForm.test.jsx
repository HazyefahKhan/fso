import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import BlogForm from './BlogForm'

test('form calls event handler with correct details when a new blog is created', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const showFormButton = screen.getByText('create new blog')
  await user.click(showFormButton)

  const titleInput = screen.getByLabelText('title:')
  const authorInput = screen.getByLabelText('author:')
  const urlInput = screen.getByLabelText('url:')

  await user.type(titleInput, 'Testing forms with react-testing-library')
  await user.type(authorInput, 'Test Author')
  await user.type(urlInput, 'http://testurl.com')

  const submitButton = screen.getByText('create')
  await user.click(submitButton)

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog).toHaveBeenCalledWith({
    title: 'Testing forms with react-testing-library',
    author: 'Test Author',
    url: 'http://testurl.com'
  })
})
