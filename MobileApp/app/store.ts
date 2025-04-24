import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AnalysisState {
  videoUrl: string;
  commentCount: number;
  sentimentData: any;
  aiReportData: any;
  isLoading: boolean;
  error: string | null;
  setVideoUrl: (url: string) => void;
  setCommentCount: (count: number) => void;
  setSentimentData: (data: any) => void;
  setAiReportData: (data: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAnalysisStore = create<AnalysisState>()(
  persist(
    (set) => ({
      videoUrl: "",
      commentCount: 0,
      sentimentData: null,
      aiReportData: null,
      isLoading: false,
      error: null,
      setVideoUrl: (url) => set({ videoUrl: url }),
      setCommentCount: (count) => set({ commentCount: count }),
      setSentimentData: (data) => set({ sentimentData: data }),
      setAiReportData: (data) => set({ aiReportData: data }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      reset: () =>
        set({
          videoUrl: "",
          commentCount: 0,
          sentimentData: null,
          aiReportData: null,
          isLoading: false,
          error: null,
        }),
    }),
    {
      name: "analysis-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
