// src/data/videos.data.ts

export interface Video {
    length: string;
    title: string;
    URL: string;
    id: string;
    category: string;
  }
  
  export const exampleVideos: Video[] = [
    {
      id: "1",
      title: "Basic Knife Skills for Beginners",
      length: "12:30",
      URL: "https://www.youtube.com/watch?v=G-Fg7l7G1zw",
      category: "culinary arts"
    },
    {
      id: "2",
      title: "Kitchen Safety Fundamentals",
      length: "8:45",
      URL: "https://www.youtube.com/watch?v=VyW_fLwg8lw",
      category: "kitchen safety"
    },
    {
      id: "3",
      title: "The Science of Baking",
      length: "15:20",
      URL: "https://www.youtube.com/watch?v=RqFT8BC8ORg",
      category: "food science"
    },
    {
      id: "4",
      title: "Advanced Plating Techniques",
      length: "18:15",
      URL: "https://www.youtube.com/watch?v=H9XNF0Xlyf4",
      category: "culinary arts"
    },
    {
      id: "5",
      title: "Food Storage Best Practices",
      length: "10:30",
      URL: "https://www.youtube.com/watch?v=K5Q7X9NFhYw",
      category: "kitchen safety"
    },
    {
      id: "6",
      title: "Understanding Food Chemistry",
      length: "20:45",
      URL: "https://www.youtube.com/watch?v=L9ymkJK2QCU",
      category: "food science"
    }
  ];