"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { isDemoMode, getDemoEntries } from "@/lib/localStorage";
import { getKSTDateString } from "@/lib/utils";

interface PaperDiaryUploadProps {
  entries: Array<{ date: string }>;
  onUploadComplete?: () => void;
}

export default function PaperDiaryUpload({
  entries,
  onUploadComplete,
}: PaperDiaryUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string>("neutral");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [existingDates, setExistingDates] = useState<Set<string>>(new Set());
  const [isLoadingDates, setIsLoadingDates] = useState(false);

  const moods = [
    { emoji: "😀", value: "happy" },
    { emoji: "🙂", value: "neutral" },
    { emoji: "😢", value: "sad" },
    { emoji: "😡", value: "angry" },
    { emoji: "😍", value: "love" },
  ];

  useEffect(() => {
    const loadAllDates = async () => {
      if (!isOpen) return;

      setIsLoadingDates(true);
      const dates = new Set<string>();

      // 현재 표시된 entries의 날짜 추가
      entries.forEach((entry) => {
        dates.add(entry.date);
      });

      // 체험 모드가 아니면 API에서 모든 날짜 가져오기
      if (!isDemoMode()) {
        try {
          const supabase = createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (user) {
            // 모든 entries의 날짜 가져오기
            const { data: allEntries } = await supabase
              .from("entries")
              .select("date")
              .eq("user_id", user.id);

            allEntries?.forEach((entry) => {
              dates.add(entry.date);
            });
          }
        } catch (error) {}
      } else {
        // 체험 모드: 로컬스토리지에서 모든 날짜 가져오기
        const { getDemoEntries } = await import("@/lib/localStorage");
        const allEntries = getDemoEntries();
        allEntries.forEach((entry) => {
          dates.add(entry.date);
        });
      }

      setExistingDates(dates);
      setIsLoadingDates(false);
    };

    loadAllDates();
  }, [isOpen, entries]);

  const handleDateSelect = (date: string) => {
    if (existingDates.has(date)) {
      return; // 이미 일기가 있는 날짜는 선택 불가
    }
    setSelectedDate(date);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일만 허용
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      e.target.value = "";
      return;
    }

    // 파일 크기 검증 (10MB 제한)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      alert(
        `이미지 파일 크기는 10MB 이하여야 합니다. (현재: ${(
          file.size /
          1024 /
          1024
        ).toFixed(2)}MB)`
      );
      e.target.value = "";
      return;
    }

    setSelectedFile(file);

    // 미리보기 이미지 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedDate) {
      alert("파일이 업로드 되지 않았습니다.");
      return;
    }

    setIsUploading(true);

    try {
      if (isDemoMode()) {
        // 체험 모드: 로컬스토리지에 저장
        const optimizedImage = await optimizeImage(selectedFile);
        await saveToLocalStorage(selectedDate, optimizedImage, selectedMood);
        alert("종이 일기가 업로드되었습니다.");
      } else {
        // 로그인 모드: 서버 API를 통해 업로드
        const optimizedImage = await optimizeImage(selectedFile);
        const blob = await dataURLToBlob(optimizedImage);
        const formData = new FormData();
        formData.append("date", selectedDate);
        formData.append("mood", selectedMood);
        formData.append("image", blob, "diary.jpg");

        const response = await fetch("/api/paper-diary", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "업로드 실패");
        }

        alert("종이 일기가 업로드되었습니다.");
      }

      setIsOpen(false);
      setSelectedDate(null);
      setSelectedMood("neutral");
      setSelectedFile(null);
      setPreviewImage(null);
      onUploadComplete?.();
    } catch (error: any) {
      const errorMessage =
        error?.message ||
        error?.error?.message ||
        "이미지 업로드 중 오류가 발생했습니다.";
      alert(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    // 미리보기 URL 정리 (메모리 누수 방지)
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
    setIsOpen(false);
    setSelectedDate(null);
    setSelectedMood("neutral");
    setSelectedFile(null);
    setPreviewImage(null);
  };

  const optimizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Canvas context not available"));
            return;
          }

          // 최대 크기 설정 (모바일: 1200px, 데스크탑: 1920px)
          const maxWidth = window.innerWidth < 768 ? 1200 : 1920;
          const maxHeight = window.innerWidth < 768 ? 1600 : 2400;

          let width = img.width;
          let height = img.height;

          // 비율 유지하면서 리사이즈
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = width * ratio;
            height = height * ratio;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // JPEG로 변환 (품질 0.85)
          const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
          resolve(dataUrl);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const dataURLToBlob = (dataURL: string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      try {
        const base64Data = dataURL.split(",")[1] || dataURL;
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "image/jpeg" });
        resolve(blob);
      } catch (error) {
        reject(error);
      }
    });
  };

  const saveToLocalStorage = async (
    date: string,
    imageData: string,
    mood: string
  ) => {
    const demoEntries = getDemoEntries();
    const existingEntry = demoEntries.find((e) => e.date === date);

    if (existingEntry) {
      // 기존 일기에 이미지 추가
      const { saveDemoEntry } = await import("@/lib/localStorage");
      saveDemoEntry({
        ...existingEntry,
        mood,
        paper_diary_image: imageData,
      });
    } else {
      // 새 일기 생성 (이미지만 있는 경우)
      const { saveDemoEntry } = await import("@/lib/localStorage");
      saveDemoEntry({
        id: `demo_${date}_${Date.now()}`,
        date,
        content: "종이 일기",
        mood,
        paper_diary_image: imageData,
      });
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        data-paper-upload
        className="hidden"
        aria-hidden="true"
      />
      {isOpen && (
        <DatePickerModal
          existingDates={existingDates}
          selectedDate={selectedDate}
          selectedMood={selectedMood}
          selectedFile={selectedFile}
          previewImage={previewImage}
          moods={moods}
          onDateSelect={handleDateSelect}
          onMoodSelect={setSelectedMood}
          onFileSelect={handleFileSelect}
          onUpload={handleUpload}
          onCancel={handleCancel}
          isUploading={isUploading}
        />
      )}
    </>
  );
}

interface DatePickerModalProps {
  existingDates: Set<string>;
  selectedDate: string | null;
  selectedMood: string;
  selectedFile: File | null;
  previewImage: string | null;
  moods: Array<{ emoji: string; value: string }>;
  onDateSelect: (date: string) => void;
  onMoodSelect: (mood: string) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
  onCancel: () => void;
  isUploading: boolean;
}

function DatePickerModal({
  existingDates,
  selectedDate,
  selectedMood,
  selectedFile,
  previewImage,
  moods,
  onDateSelect,
  onMoodSelect,
  onFileSelect,
  onUpload,
  onCancel,
  isUploading,
}: DatePickerModalProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = getKSTDateString();

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // 빈 칸 추가 (첫 주 시작일 맞추기)
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // 날짜 추가
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  const formatDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const isDateDisabled = (date: Date): boolean => {
    const dateStr = formatDateString(date);
    return existingDates.has(dateStr);
  };

  const isDateInFuture = (date: Date): boolean => {
    const dateStr = formatDateString(date);
    return dateStr > today;
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-card-dark rounded-xl shadow-lg max-w-md w-full p-4 sm:p-6 my-auto max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-text-main-light dark:text-text-main-dark">
            종이 일기 업로드
          </h2>
          <button
            onClick={onCancel}
            className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 flex justify-between items-center">
          <button
            onClick={() => {
              const prevMonth = new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() - 1
              );
              setCurrentMonth(prevMonth);
            }}
            className="px-3 py-1 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary"
          >
            ←
          </button>
          <span className="text-base sm:text-lg font-semibold">
            {currentMonth.getFullYear()}년 {monthNames[currentMonth.getMonth()]}
          </span>
          <button
            onClick={() => {
              const nextMonth = new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() + 1
              );
              setCurrentMonth(nextMonth);
            }}
            className="px-3 py-1 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary"
          >
            →
          </button>
        </div>

        <div className="mb-4">
          <div className="grid grid-cols-7 gap-1 min-h-[248px] sm:min-h-[300px]">
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center text-xs sm:text-sm font-bold text-black dark:text-black py-2"
              >
                {day}
              </div>
            ))}
            {days.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="h-8 sm:h-10" />;
              }

              const dateStr = formatDateString(date);
              const isDisabled = isDateDisabled(date) || isDateInFuture(date);
              const isSelected = selectedDate === dateStr;
              const dayOfWeek = date.getDay(); // 0: 일요일, 6: 토요일
              const isSunday = dayOfWeek === 0;
              const isSaturday = dayOfWeek === 6;

              // 일요일/토요일 색상 결정
              let dateColor = "";
              if (!isSelected && !isDisabled) {
                if (isSunday) {
                  dateColor = "text-[#d03232]";
                } else if (isSaturday) {
                  dateColor = "text-[#3c63e1]";
                }
              }

              return (
                <button
                  key={dateStr}
                  onClick={() => !isDisabled && onDateSelect(dateStr)}
                  disabled={isDisabled}
                  className={`h-8 sm:h-10 text-xs sm:text-sm rounded transition-colors ${
                    isSelected
                      ? "bg-primary text-white"
                      : isDisabled
                      ? "text-text-secondary-light dark:text-text-secondary-dark opacity-40 cursor-not-allowed"
                      : `hover:bg-primary/10 text-text-main-light dark:text-text-main-dark ${dateColor}`
                  }`}
                  title={
                    isDateDisabled(date)
                      ? "이미 일기가 있는 날짜입니다"
                      : isDateInFuture(date)
                      ? "미래 날짜는 선택할 수 없습니다"
                      : ""
                  }
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        {selectedDate && (
          <>
            <div className="mt-4">
              <span className="block text-sm sm:text-base font-medium mb-2 text-text-main-light dark:text-text-main-dark">
                감정 선택
              </span>
              <div className="flex gap-2 sm:gap-3 justify-center">
                {moods.map((mood) => (
                  <button
                    key={mood.value}
                    type="button"
                    onClick={() => onMoodSelect(mood.value)}
                    disabled={isUploading}
                    className={`text-2xl sm:text-3xl p-2 sm:p-3 rounded-lg transition-all ${
                      selectedMood === mood.value
                        ? "bg-primary/20 scale-110 ring-2 ring-primary"
                        : "hover:bg-primary/10"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {mood.emoji}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <label className="block">
                <span className="block text-sm sm:text-base font-medium mb-2 text-text-main-light dark:text-text-main-dark">
                  이미지 선택
                </span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={onFileSelect}
                  disabled={isUploading}
                  className="block w-full text-sm text-text-secondary-light dark:text-text-secondary-dark file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </label>
              {previewImage && (
                <div className="mt-4 w-full flex justify-center">
                  <div className="relative max-w-[150px] sm:max-w-[180px] rounded-lg overflow-hidden border-2 border-primary/20 shadow-md">
                    <img
                      src={previewImage}
                      alt="미리보기"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4 flex gap-2 sm:gap-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={isUploading}
                className="flex-1 px-4 py-2 text-sm sm:text-base font-medium text-text-main-light dark:text-text-main-dark bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                취소
              </button>
              <button
                type="button"
                onClick={onUpload}
                disabled={isUploading || !selectedFile || !selectedDate}
                className="flex-1 px-4 py-2 text-sm sm:text-base font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? "업로드 중..." : "업로드"}
              </button>
            </div>
          </>
        )}

        {!selectedDate && (
          <p className="text-xs sm:text-sm text-text-secondary-light dark:text-text-secondary-dark text-center mt-4">
            일기가 없는 날짜를 선택해주세요
          </p>
        )}
      </div>
    </div>
  );
}
