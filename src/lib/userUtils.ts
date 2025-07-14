// Utility function to generate consistent user emojis based on user ID
export const getUserEmoji = (userId: string): string => {
  // Array of professional/person emojis
  const emojis = [
    '👩‍💼', // Alice - business woman
    '👨‍💼', // Business man
    '👩‍🔬', // Woman scientist
    '👨‍🔬', // Man scientist
    '👩‍💻', // Woman technologist
    '👨‍💻', // Man technologist
    '👩‍🎨', // Woman artist
    '👨‍🎨', // Man artist
    '👩‍🏫', // Woman teacher
    '👨‍🏫', // Man teacher
    '👩‍⚕️', // Woman health worker
    '👨‍⚕️', // Man health worker
    '👩‍🌾', // Woman farmer
    '👨‍🌾', // Man farmer
    '👩‍🍳', // Woman cook
    '👨‍🍳', // Man cook
    '👩‍🔧', // Woman mechanic
    '👨‍🔧', // Man mechanic
    '👩‍✈️', // Woman pilot
    '👨‍✈️', // Man pilot
    '👩‍🚀', // Woman astronaut
    '👨‍🚀', // Man astronaut
    '👩‍⚖️', // Woman judge
    '👨‍⚖️', // Man judge
    '🧑‍💼', // Person in business suit
    '🧑‍🔬', // Person scientist
    '🧑‍💻', // Person technologist
    '🧑‍🎨', // Person artist
    '🧑‍🏫', // Person teacher
    '🧑‍⚕️', // Person health worker
  ];

  // Create a simple hash from the user ID
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Use absolute value and modulo to get a consistent index
  const index = Math.abs(hash) % emojis.length;
  return emojis[index];
};

// Get user name based on emoji (for display purposes)
export const getUserName = (emoji: string): string => {
  const nameMap: Record<string, string> = {
    '👩‍💼': 'Alice',
    '👨‍💼': 'Bob', 
    '👩‍🔬': 'Diana',
    '👨‍🔬': 'Carl',
    '👩‍💻': 'Eva',
    '👨‍💻': 'Frank',
    '👩‍🎨': 'Grace',
    '👨‍🎨': 'Henry',
    '👩‍🏫': 'Iris',
    '👨‍🏫': 'Jack',
    '👩‍⚕️': 'Kate',
    '👨‍⚕️': 'Leo',
    '👩‍🌾': 'Maya',
    '👨‍🌾': 'Nick',
    '👩‍🍳': 'Olive',
    '👨‍🍳': 'Paul',
    '👩‍🔧': 'Quinn',
    '👨‍🔧': 'Ryan',
    '👩‍✈️': 'Sophia',
    '👨‍✈️': 'Tom',
    '👩‍🚀': 'Uma',
    '👨‍🚀': 'Victor',
    '👩‍⚖️': 'Wendy',
    '👨‍⚖️': 'Xavier',
    '🧑‍💼': 'Yuki',
    '🧑‍🔬': 'Zara',
    '🧑‍💻': 'Alex',
    '🧑‍🎨': 'Blake',
    '🧑‍🏫': 'Casey',
    '🧑‍⚕️': 'Drew',
  };

  return nameMap[emoji] || 'User';
};
