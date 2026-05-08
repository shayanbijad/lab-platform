import BlogEditorForm from "@/app/_components/blogs/BlogEditorForm";
import { getBlog } from "@/lib/api";

export default async function EditBlogPage({ params }) {
  const blog = await getBlog(params.id);
  return <BlogEditorForm initialBlog={blog} />;
}
