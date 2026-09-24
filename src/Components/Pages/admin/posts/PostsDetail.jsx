import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PageHeader from "@/Components/Admin/common/PageHeader";
import Card from "@/Components/Admin/common/Card";
import Badge from "@/Components/Admin/common/Badge";
import Button from "@/Components/Admin/common/Button";
import { mockPostDetail } from "@/mocks/postsMock";

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = mockPostDetail(id);

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-base text-gray-500 hover:text-gray-700 mb-4 transition-colors"
      >
        <ArrowLeft size={15} /> Back to Posts
      </button>
      <PageHeader
        title={post.title}
        description={`by ${post.author}`}
        actions={
          <>
            <Button variant="secondary" size="sm">
              Edit
            </Button>
            <Button variant="danger" size="sm">
              Delete
            </Button>
          </>
        }
      />
      <Card className="p-6">
        <p className="text-base text-gray-700 leading-relaxed">{post.body}</p>
        <div className="flex gap-1.5 mt-4">
          {post.tags.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
        <div className="flex gap-6 mt-4 text-base text-gray-500">
          <span>{post.views.toLocaleString()} views</span>
          <span>{post.score} score</span>
        </div>
      </Card>
      <Card className="p-6 mt-4">
        <h3 className="font-semibold text-gray-900 mb-3">Comments</h3>
        <div className="divide-y divide-gray-50">
          {post.comments.map((c) => (
            <div key={c.id} className="py-2.5">
              <p className="text-base font-medium text-gray-700">{c.author}</p>
              <p className="text-base text-gray-500">{c.body}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
