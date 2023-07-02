import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Post } from 'types/blog.type'

// createApi tương tự createSlice hay còn gọi là slice api
// cần khai báo baseUrl và các endpoints

//  endPoints  là tập hợp các method GET, PUT, POST, DELETE,... tương tác vs server
// khi khai báo endPoints sẽ sinh ra các hook tương ứng dùng trong component
// endPoinst có 2 kiểu: QUERY (dùng cho method GET); MUTATION (dùng cho method POST,PUT,DELETE)

// fetchBaseQuery được build dựa trên fetch API, có thể dùng axios cũng được

export const blogApi = createApi({
  reducerPath: 'blogApi', // tên field trong redux state
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/' }),
  endpoints: (build) => ({
    //generic type theo thứ tự là kiểu response trả về và argument
    getPosts: build.query<Post[], void>({
      // query return "posts" khi đó url là baseUrl+"posts"
      query: () => 'posts' // method ko có argument
    })
  })
})

// các hook được sinh ra từ endpoints của blogApi
export const { useGetPostsQuery } = blogApi
