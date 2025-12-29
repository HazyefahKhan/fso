const loginWith = async (page, username, password) => {
  await page.locator('input[name="username"]').fill(username)
  await page.locator('input[name="password"]').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'create new blog' }).click()
  await page.getByLabel('title:').fill(title)
  await page.getByLabel('author:').fill(author)
  await page.getByLabel('url:').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  
  await page.getByText(`a new blog ${title} by ${author} added`).waitFor()
  await page.getByRole('button', { name: 'close' }).click()
}

module.exports = { loginWith, createBlog }
