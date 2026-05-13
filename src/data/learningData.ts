import { LearningItem } from '../types';

export const ALPHABETS: LearningItem[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(char => ({
  id: char,
  name: char,
  description: char,
  color: `hsl(${Math.random() * 360}, 70%, 60%)`
}));

export const NUMBERS: LearningItem[] = Array.from({ length: 100 }, (_, i) => ({
  id: `${i + 1}`,
  name: `${i + 1}`,
  description: `${i + 1}`,
  color: `hsl(${(i * 37) % 360}, 70%, 55%)`
}));

export const COLORS: LearningItem[] = [
  { id: 'red', name: 'Red', color: '#EF4444' },
  { id: 'blue', name: 'Blue', color: '#3B82F6' },
  { id: 'green', name: 'Green', color: '#10B981' },
  { id: 'yellow', name: 'Yellow', color: '#F59E0B' },
  { id: 'purple', name: 'Purple', color: '#8B5CF6' },
  { id: 'orange', name: 'Orange', color: '#F97316' },
  { id: 'pink', name: 'Pink', color: '#EC4899' },
  { id: 'brown', name: 'Brown', color: '#78350F' },
];

export const SHAPES: LearningItem[] = [
  { id: 'circle', name: 'Circle', description: '⭕' },
  { id: 'square', name: 'Square', description: '⬜' },
  { id: 'triangle', name: 'Triangle', description: '🔺' },
  { id: 'star', name: 'Star', description: '⭐' },
  { id: 'heart', name: 'Heart', description: '❤️' },
];

export const ANIMALS: LearningItem[] = [
  { id: 'lion', name: 'Lion', description: '🦁' },
  { id: 'elephant', name: 'Elephant', description: '🐘' },
  { id: 'monkey', name: 'Monkey', description: '🐒' },
  { id: 'tiger', name: 'Tiger', description: '🐯' },
  { id: 'dog', name: 'Dog', description: '🐶' },
  { id: 'cat', name: 'Cat', description: '🐱' },
  { id: 'giraffe', name: 'Giraffe', description: '🦒' },
  { id: 'zebra', name: 'Zebra', description: '🦓' },
  { id: 'panda', name: 'Panda', description: '🐼' },
  { id: 'rabbit', name: 'Rabbit', description: '🐰' },
];

export const FRUITS: LearningItem[] = [
  { id: 'apple', name: 'Apple', description: '🍎' },
  { id: 'banana', name: 'Banana', description: '🍌' },
  { id: 'grape', name: 'Grape', description: '🍇' },
  { id: 'watermelon', name: 'Watermelon', description: '🍉' },
  { id: 'strawberry', name: 'Strawberry', description: '🍓' },
  { id: 'orange', name: 'Orange', description: '🍊' },
  { id: 'pineapple', name: 'Pineapple', description: '🍍' },
  { id: 'mango', name: 'Mango', description: '🥭' },
];
