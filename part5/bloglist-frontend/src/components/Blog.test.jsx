import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'http://example.com',
    likes: 0,
    user: { name: 'Tester', username: 'tester' }
  }

  const { container } = render(<Blog blog={blog} />)

  const element = screen.getByText('Component testing is done with react-testing-library', { exact: false })
  expect(element).toBeDefined()

  const authorElement = screen.getByText('Test Author', { exact: false })
  expect(authorElement).toBeDefined()

  const detailsDiv = container.querySelector('.blog-details')
  expect(detailsDiv).toHaveStyle('display: none')
})

test('clicking the view button shows URL and likes', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'http://example.com',
    likes: 5,
    user: { name: 'Tester', username: 'tester' }
  }

  const { container } = render(<Blog blog={blog} />)
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const detailsDiv = container.querySelector('.blog-details')
  expect(detailsDiv).not.toHaveStyle('display: none')

  const urlElement = screen.getByText('http://example.com')
  expect(urlElement).toBeDefined()

  const likesElement = screen.getByText('5', { exact: false })
  expect(likesElement).toBeDefined()
})

test('clicking the like button twice calls event handler twice', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'http://example.com',
    likes: 5,
    user: { name: 'Tester', username: 'tester' }
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} addLike={mockHandler} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)
  expect(mockHandler).toHaveBeenCalledTimes(2)
})