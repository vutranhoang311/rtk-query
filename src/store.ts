import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import { blogApi } from 'pages/blog/blog.services'
import blogSlice from 'pages/blog/blog.slice'
// ...

export const store = configureStore({
  reducer: {
    blog: blogSlice,
    // blogApi reducerPath set up redux state cho blogApi.reducer được tạo từ createApi api slice
    [blogApi.reducerPath]: blogApi.reducer
  },
  // thêm api  middleware để enable: caching, invalidation, polling của rtk-query
  middleware: (getDefautlMiddleware) => {
    return getDefautlMiddleware().concat(blogApi.middleware)
  }
})

// optional, nếu dùng refetchOnFocus/refetchOnReconnect thì setupListeners
setupListeners(store.dispatch)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
