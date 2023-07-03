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
  tagTypes: ['Posts'], // những kiểu tags cho phép dùng trong blogAPI
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/' }),
  endpoints: (build) => ({
    //generic type theo thứ tự là kiểu response trả về và argument
    getPosts: build.query<Post[], void>({
      // query return "posts" khi đó url là baseUrl+"posts"
      query: () => 'posts', // method ko có argument
      providesTags(result) {
        /**
         * Callback này sẽ chạy mỗi khi getPosts chạy
         * Mong muốn trả về mảng kiểu
         * ``
         * `` interface Tags: {type:"Posts",id:string}[]
         * ``
         *
         *
         */

        if (result) {
          const final = [
            ...result.map((item) => ({ type: 'Posts' as const, id: item.id })),
            { type: 'Posts' as const, id: 'LIST' }
          ]
          return final
        }
        const final = [{ type: 'Posts' as const, id: 'LIST' }]
        return final
      }
    }),

    // dùng mitation đối với các method POST,PUT,DELETE
    // POST là response trả về và Omit<Post, 'id'> là body gửi lên
    addPost: build.mutation<Post, Omit<Post, 'id'>>({
      query(body) {
        return { url: 'posts', method: 'POST', body }
      },
      /**
       * invalidatesTags cung cấp các tag để báo hiệu cho method nào có provideTags match với nó sẽ bị gọi lại
       */
      invalidatesTags: (result, error, body) => [{ type: 'Posts', id: 'LIST' }]
    }),
    getPost: build.query<Post, string>({
      query(id) {
        return `posts/${id}`
      }
    }),
    updatePost: build.mutation<Post, Post>({
      query(data) {
        return {
          url: `posts/${data.id}`,
          method: 'PUT',
          body: data
        }
      },
      // In this case, getPosts run again
      invalidatesTags: (result, error, data) => [{ type: 'Posts', id: data.id }]
    }),
    deletePost: build.mutation<{}, string>({
      query(id) {
        return { url: `posts/${id}`, method: 'DELETE' }
      },
      invalidatesTags: (result, error, id) => [{ type: 'Posts', id }]
    })
  })
})

// các hook được sinh ra từ endpoints của blogApi
export const { useGetPostsQuery, useAddPostMutation, useGetPostQuery, useUpdatePostMutation, useDeletePostMutation } =
  blogApi
