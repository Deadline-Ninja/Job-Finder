import { MoreHorizontal, ThumbsUp, MessageSquare, Share2, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Post } from '../data/mockData';

interface FeedItemProps {
  post: Post;
}

export function FeedItem({ post }: FeedItemProps) {
  return (
    <div className="bg-white border border-[#00000014] rounded-lg shadow-sm mb-4">
      {/* Header */}
      <div className="p-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={post.authorAvatar} 
            alt={post.authorName} 
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="text-sm font-semibold text-[#000000E0] hover:text-[#0A66C2] hover:underline cursor-pointer">
              {post.authorName}
            </h3>
            <p className="text-xs text-[#00000099] line-clamp-1">{post.authorTitle}</p>
            <p className="text-[10px] text-[#00000099] mt-0.5">{post.timestamp} • 🌏</p>
          </div>
        </div>
        <button className="text-[#00000099] hover:bg-black/5 p-1 rounded-full">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-sm text-[#000000E0] whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Image */}
      {post.image && (
        <div className="mt-2 border-t border-b border-[#0000000D]">
          <img src={post.image} alt="Post content" className="w-full h-auto" />
        </div>
      )}

      {/* Stats */}
      <div className="px-4 py-2 flex items-center justify-between border-b border-[#0000000D]">
        <div className="flex items-center gap-1.5 cursor-pointer hover:underline text-[10px] text-[#00000099]">
          <div className="flex -space-x-1">
            <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center border border-white">
              <ThumbsUp className="w-2.5 h-2.5 text-white fill-white" />
            </div>
          </div>
          <span>{post.likes}</span>
        </div>
        <div className="text-[10px] text-[#00000099] hover:text-[#0A66C2] cursor-pointer hover:underline">
          {post.comments} comments
        </div>
      </div>

      {/* Actions */}
      <div className="px-1 py-1 flex items-center justify-around">
        <Button variant="ghost" className="flex-1 flex items-center gap-2 text-[#00000099] hover:bg-black/5 rounded-sm h-12">
          <ThumbsUp className="w-5 h-5" />
          <span className="text-sm font-semibold">Like</span>
        </Button>
        <Button variant="ghost" className="flex-1 flex items-center gap-2 text-[#00000099] hover:bg-black/5 rounded-sm h-12">
          <MessageSquare className="w-5 h-5" />
          <span className="text-sm font-semibold">Comment</span>
        </Button>
        <Button variant="ghost" className="flex-1 flex items-center gap-2 text-[#00000099] hover:bg-black/5 rounded-sm h-12">
          <Share2 className="w-5 h-5" />
          <span className="text-sm font-semibold">Share</span>
        </Button>
        <Button variant="ghost" className="flex-1 flex items-center gap-2 text-[#00000099] hover:bg-black/5 rounded-sm h-12">
          <Send className="w-5 h-5" />
          <span className="text-sm font-semibold">Send</span>
        </Button>
      </div>
    </div>
  );
}
