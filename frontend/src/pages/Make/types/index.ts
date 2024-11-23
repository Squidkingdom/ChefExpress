export interface Ingredient {
    name: string;
    quantity: string;
    unit: string;
  }
  
  export interface Recipe {
    id: number;
    title: string;
    description: string;
    ingredients: Ingredient[];
    instructions: string;
    image: string | null;
    prepTime?: string;
    cookTime?: string;
    difficulty?: 'Easy' | 'Medium' | 'Hard';
    servings?: number;
    favorite?: boolean;
    planned?: boolean;
    created: string;
    isPublic: boolean;
    author?: {
      name: string;
      id: string;
      avatar?: string;
    };
    likes?: number;
    comments?: Comment[];
    shares?: number;
    tags?: string[];
  }
  
  export interface Comment {
    id: number;
    recipeId: number;
    text: string;
    author: {
      name: string;
      id: string;
      avatar?: string;
    };
    created: string;
  }
  
  export type ViewType = "select" | "create" | "planner" | "view" | "explore";
  
  export interface SelectionOption {
    icon: React.ComponentType;
    secondaryIcon?: React.ComponentType;
    title: string;
    description: string;
    action: () => void;
    gradient: string;
    features?: string[];
  }
  
  export interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    recipe: Recipe;
    onShare: (recipe: Recipe, description: string) => void;
  }
  
  export interface RecipeFormProps {
    onSave: (recipe: Recipe) => void;
    onCancel: () => void;
    initialData?: Recipe;
    onShare?: (recipe: Recipe) => void;
  }
  
  export interface RecipeCardProps {
    recipe: Recipe;
    onLike?: () => void;
    onComment?: () => void;
    onShare?: () => void;
    isPublic?: boolean;
  }