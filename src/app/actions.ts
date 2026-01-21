"use server";

import { createClient } from "@/lib/supabase/server";

export async function toggleLike(adId: number) {
  const supabase = await createClient();

  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "not_authenticated" };
  }

  // Check if user already liked this ad
  const { data: existingLike } = await supabase
    .from("likes")
    .select("id")
    .eq("user_id", user.id)
    .eq("ad_id", adId)
    .single();

  if (existingLike) {
    // Remove like
    await supabase
      .from("likes")
      .delete()
      .eq("user_id", user.id)
      .eq("ad_id", adId);

    // Decrement count on ads table
    const { data: ad } = await supabase
      .from("ads")
      .select("likes")
      .eq("id", adId)
      .single();

    if (ad && ad.likes > 0) {
      await supabase
        .from("ads")
        .update({ likes: ad.likes - 1 })
        .eq("id", adId);
    }

    return { liked: false };
  } else {
    // Add like
    await supabase
      .from("likes")
      .insert({ user_id: user.id, ad_id: adId });

    // Increment count on ads table
    const { data: ad } = await supabase
      .from("ads")
      .select("likes")
      .eq("id", adId)
      .single();

    if (ad) {
      await supabase
        .from("ads")
        .update({ likes: (ad.likes || 0) + 1 })
        .eq("id", adId);
    }

    return { liked: true };
  }
}

export async function checkIfLiked(adId: number) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { liked: false, isAuthenticated: false };
  }

  const { data: existingLike } = await supabase
    .from("likes")
    .select("id")
    .eq("user_id", user.id)
    .eq("ad_id", adId)
    .single();

  return { liked: !!existingLike, isAuthenticated: true };
}
