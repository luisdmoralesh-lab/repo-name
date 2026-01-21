"use client";

import { toggleLike, checkIfLiked } from "@/app/actions";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

interface LikeButtonProps {
  adId: number;
  likes: number;
  size?: "sm" | "lg";
}

export default function LikeButton({ adId, likes, size = "sm" }: LikeButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const isProcessing = useRef(false);

  useEffect(() => {
    // Check if user already liked this ad
    checkIfLiked(adId).then(({ liked, isAuthenticated }) => {
      setLiked(liked);
      setIsAuthenticated(isAuthenticated);
    });
  }, [adId]);

  async function handleLike(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (isPending || isProcessing.current) return;

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push("/login?mensaje=like");
      return;
    }

    isProcessing.current = true;

    // Optimistic update
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount(prev => wasLiked ? prev - 1 : prev + 1);

    startTransition(async () => {
      const result = await toggleLike(adId);

      if (result.error === "not_authenticated") {
        // Revert and redirect
        setLiked(wasLiked);
        setLikeCount(prev => wasLiked ? prev + 1 : prev - 1);
        router.push("/login?mensaje=like");
      }

      isProcessing.current = false;
    });
  }

  const baseClasses = size === "lg"
    ? "px-4 py-2 text-base gap-2"
    : "px-2 py-1 text-sm gap-1";

  return (
    <button
      onClick={handleLike}
      disabled={isPending}
      className={`inline-flex items-center rounded-full font-medium transition-all ${baseClasses} ${
        liked
          ? "bg-red-100 text-red-600"
          : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500"
      }`}
    >
      <svg
        className={size === "lg" ? "w-5 h-5" : "w-4 h-4"}
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {likeCount}
    </button>
  );
}
