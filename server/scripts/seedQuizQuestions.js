// server/scripts/seedQuizQuestions.js
const AWS = require('aws-sdk');
require('dotenv').config();

// Configure AWS
AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1'
});

const docClient = new AWS.DynamoDB.DocumentClient();

const questions = [
  // Fractions and Decimals
  {
    id: '1',
    text: 'What is the decimal equivalent of \\frac{3}{4}?',
    answer: '0.75',
    solution: 'To convert a fraction to a decimal, divide the numerator by the denominator: 3 ÷ 4 = 0.75',
    difficulty: 'easy',
    topicId: 'fractions'
  },
  {
    id: '2',
    text: 'Simplify the fraction \\frac{18}{24}',
    answer: '\\frac{3}{4}',
    solution: 'Find the greatest common factor (GCF) of 18 and 24, which is 6. Divide both the numerator and denominator by 6: 18 ÷ 6 = 3 and 24 ÷ 6 = 4. So the simplified fraction is \\frac{3}{4}.',
    difficulty: 'easy',
    topicId: 'fractions'
  },
  {
    id: '3',
    text: 'Add the fractions: \\frac{2}{5} + \\frac{1}{3}',
    answer: '\\frac{11}{15}',
    solution: 'Find a common denominator: LCD of 5 and 3 is 15. Convert the fractions: \\frac{2}{5} = \\frac{6}{15} and \\frac{1}{3} = \\frac{5}{15}. Then add: \\frac{6}{15} + \\frac{5}{15} = \\frac{11}{15}.',
    difficulty: 'medium',
    topicId: 'fractions'
  },
  {
    id: '4',
    text: 'Convert 0.375 to a fraction in simplest form.',
    answer: '\\frac{3}{8}',
    solution: 'Write as \\frac{375}{1000}, then simplify. Divide both numbers by 125: \\frac{375 ÷ 125}{1000 ÷ 125} = \\frac{3}{8}.',
    difficulty: 'medium',
    topicId: 'fractions'
  },
  
  // Basic Algebra
  {
    id: '5',
    text: 'Solve for x: x + 7 = 15',
    answer: 'x = 8',
    solution: 'To solve, subtract 7 from both sides of the equation: x + 7 - 7 = 15 - 7, which gives us x = 8.',
    difficulty: 'easy',
    topicId: 'algebra'
  },
  {
    id: '6',
    text: 'Solve for y: 3y = 27',
    answer: 'y = 9',
    solution: 'To solve, divide both sides by 3: 3y ÷ 3 = 27 ÷ 3, which gives us y = 9.',
    difficulty: 'easy',
    topicId: 'algebra'
  },
  {
    id: '7',
    text: 'Solve for x: 2x - 5 = 11',
    answer: 'x = 8',
    solution: 'First, add 5 to both sides: 2x - 5 + 5 = 11 + 5, which gives 2x = 16. Then divide both sides by 2: 2x ÷ 2 = 16 ÷ 2, resulting in x = 8.',
    difficulty: 'medium',
    topicId: 'algebra'
  },
  {
    id: '8',
    text: 'If x + y = 12 and x - y = 4, what is the value of x?',
    answer: 'x = 8',
    solution: 'Add the two equations: (x + y) + (x - y) = 12 + 4. This simplifies to 2x = 16. Divide both sides by 2: x = 8.',
    difficulty: 'medium',
    topicId: 'algebra'
  },
  
  // Geometry
  {
    id: '9',
    text: 'What is the area of a rectangle with length 8 cm and width 5 cm?',
    answer: '40 \\text{ cm}^2',
    solution: 'The area of a rectangle is calculated by multiplying the length by the width: Area = 8 cm × 5 cm = 40 cm².',
    difficulty: 'easy',
    topicId: 'geometry'
  },
  {
    id: '10',
    text: 'What is the perimeter of a square with side length 9 cm?',
    answer: '36 \\text{ cm}',
    solution: 'The perimeter of a square is calculated by multiplying the side length by 4: Perimeter = 4 × 9 cm = 36 cm.',
    difficulty: 'easy',
    topicId: 'geometry'
  },
  {
    id: '11',
    text: 'Find the area of a triangle with base 12 cm and height 5 cm.',
    answer: '30 \\text{ cm}^2',
    solution: 'The area of a triangle is calculated using the formula: Area = \\frac{1}{2} × base × height. So, Area = \\frac{1}{2} × 12 cm × 5 cm = 30 cm².',
    difficulty: 'medium',
    topicId: 'geometry'
  },
  {
    id: '12',
    text: 'What is the volume of a rectangular prism with length 4 cm, width 3 cm, and height 5 cm?',
    answer: '60 \\text{ cm}^3',
    solution: 'The volume of a rectangular prism is calculated by multiplying the length, width, and height: Volume = 4 cm × 3 cm × 5 cm = 60 cm³.',
    difficulty: 'medium',
    topicId: 'geometry'
  },
  
  // Ratios and Proportions
  {
    id: '13',
    text: 'If the ratio of boys to girls in a class is 3:5 and there are 24 boys, how many girls are there?',
    answer: '40',
    solution: 'Set up a proportion: \\frac{3}{5} = \\frac{24}{x}. Cross multiply: 3x = 5 × 24 = 120. Divide both sides by 3: x = 40 girls.',
    difficulty: 'medium',
    topicId: 'ratios'
  },
  {
    id: '14',
    text: 'If 2 pizzas cost $18, how much will 5 pizzas cost?',
    answer: '$45',
    solution: 'Set up a proportion: \\frac{2}{18} = \\frac{5}{x}. Cross multiply: 2x = 18 × 5 = 90. Divide both sides by 2: x = $45.',
    difficulty: 'medium',
    topicId: 'ratios'
  },
  {
    id: '15',
    text: 'Complete the equivalent ratio: 15:20 = ?:60',
    answer: '45',
    solution: 'Find the multiplier from 20 to 60, which is 3. Then multiply the first number by the same factor: 15 × 3 = 45. So the equivalent ratio is 45:60.',
    difficulty: 'medium',
    topicId: 'ratios'
  },
  {
    id: '16',
    text: 'What percentage of 80 is 20?',
    answer: '25\\%',
    solution: 'To find the percentage, divide the part by the whole and multiply by 100: (20 ÷ 80) × 100 = 0.25 × 100 = 25%.',
    difficulty: 'medium',
    topicId: 'percentages'
  },
  
  // Basic Statistics
  {
    id: '17',
    text: 'Find the mean of the numbers: 15, 20, 25, 18, 22',
    answer: '20',
    solution: 'To find the mean, add all the numbers and divide by the count: (15 + 20 + 25 + 18 + 22) ÷ 5 = 100 ÷ 5 = 20.',
    difficulty: 'easy',
    topicId: 'statistics'
  },
  {
    id: '18',
    text: 'Find the median of the numbers: 7, 3, 9, 5, 11',
    answer: '7',
    solution: 'Arrange the numbers in ascending order: 3, 5, 7, 9, 11. The median is the middle value, which is 7.',
    difficulty: 'easy',
    topicId: 'statistics'
  },
  {
    id: '19',
    text: 'Find the mode of the numbers: 4, 6, 8, 6, 9, 6, 5',
    answer: '6',
    solution: 'The mode is the value that appears most frequently. In this set, 6 appears three times, while other numbers appear only once. So the mode is 6.',
    difficulty: 'easy',
    topicId: 'statistics'
  },
  {
    id: '20',
    text: 'Find the range of the numbers: 12, 8, 25, 17, 15',
    answer: '17',
    solution: 'The range is the difference between the largest and smallest values: 25 - 8 = 17.',
    difficulty: 'easy',
    topicId: 'statistics'
  },
  
  // Integers and Operations
  {
    id: '21',
    text: 'Evaluate: -3 + 8',
    answer: '5',
    solution: 'To add a negative number, subtract its absolute value: -3 + 8 is the same as 8 - 3 = 5.',
    difficulty: 'easy',
    topicId: 'integers'
  },
  {
    id: '22',
    text: 'Evaluate: 6 - (-4)',
    answer: '10',
    solution: 'Subtracting a negative number is the same as adding its positive value: 6 - (-4) = 6 + 4 = 10.',
    difficulty: 'medium',
    topicId: 'integers'
  },
  {
    id: '23',
    text: 'Evaluate: -5 × 4',
    answer: '-20',
    solution: 'When multiplying a negative number by a positive number, the result is negative: -5 × 4 = -20.',
    difficulty: 'medium',
    topicId: 'integers'
  },
  {
    id: '24',
    text: 'Evaluate: -12 ÷ 3',
    answer: '-4',
    solution: 'When dividing a negative number by a positive number, the result is negative: -12 ÷ 3 = -4.',
    difficulty: 'medium',
    topicId: 'integers'
  },
  
  // Order of Operations
  {
    id: '25',
    text: 'Evaluate: 3 + 4 × 2',
    answer: '11',
    solution: 'Following the order of operations (PEMDAS), multiply first, then add: 3 + (4 × 2) = 3 + 8 = 11.',
    difficulty: 'easy',
    topicId: 'operations'
  },
  {
    id: '26',
    text: 'Evaluate: 20 - 4 × 3 + 2',
    answer: '10',
    solution: 'Following PEMDAS: 20 - (4 × 3) + 2 = 20 - 12 + 2 = 8 + 2 = 10.',
    difficulty: 'medium',
    topicId: 'operations'
  },
  {
    id: '27',
    text: 'Evaluate: (6 + 2) × 5',
    answer: '40',
    solution: 'Following PEMDAS, calculate within parentheses first: (6 + 2) × 5 = 8 × 5 = 40.',
    difficulty: 'easy',
    topicId: 'operations'
  },
  {
    id: '28',
    text: 'Evaluate: 18 ÷ (2 + 4)',
    answer: '3',
    solution: 'First, calculate within the parentheses: 18 ÷ (2 + 4) = 18 ÷ 6 = 3.',
    difficulty: 'medium',
    topicId: 'operations'
  },
  
  // Word Problems
  {
    id: '29',
    text: 'Sarah has 24 apples. She gives away 1/3 of them. How many apples does she have left?',
    answer: '16',
    solution: 'Sarah gives away 1/3 of 24 apples: 24 × 1/3 = 8 apples. She has 24 - 8 = 16 apples left.',
    difficulty: 'medium',
    topicId: 'word-problems'
  },
  {
    id: '30',
    text: 'A train travels at 60 miles per hour. How far will it travel in 2.5 hours?',
    answer: '150 \\text{ miles}',
    solution: 'Distance = Speed × Time. So the train will travel 60 miles/hour × 2.5 hours = 150 miles.',
    difficulty: 'medium',
    topicId: 'word-problems'
  },
  
  // More fractions
  {
    id: '31',
    text: 'Multiply: \\frac{2}{3} × \\frac{3}{4}',
    answer: '\\frac{1}{2}',
    solution: 'To multiply fractions, multiply the numerators and denominators: \\frac{2 × 3}{3 × 4} = \\frac{6}{12} = \\frac{1}{2} in simplified form.',
    difficulty: 'medium',
    topicId: 'fractions'
  },
  {
    id: '32',
    text: 'Divide: \\frac{5}{6} ÷ \\frac{2}{3}',
    answer: '\\frac{5}{4}',
    solution: 'To divide fractions, multiply by the reciprocal of the divisor: \\frac{5}{6} × \\frac{3}{2} = \\frac{15}{12} = \\frac{5}{4} in simplified form.',
    difficulty: 'hard',
    topicId: 'fractions'
  },
  
  // More percentages
  {
    id: '33',
    text: 'What is 15% of 80?',
    answer: '12',
    solution: 'Convert percentage to decimal and multiply: 15% = 0.15, 0.15 × 80 = 12.',
    difficulty: 'easy',
    topicId: 'percentages'
  },
  {
    id: '34',
    text: 'A shirt costs $25. It is on sale for 20% off. What is the sale price?',
    answer: '$20',
    solution: 'Calculate the discount: 20% of $25 = 0.2 × $25 = $5. Sale price = Original price - Discount = $25 - $5 = $20.',
    difficulty: 'medium',
    topicId: 'percentages'
  },
  
  // Additional questions to reach 50
  {
    id: '35',
    text: 'What is the greatest common factor (GCF) of 24 and 36?',
    answer: '12',
    solution: 'List factors of 24: 1, 2, 3, 4, 6, 8, 12, 24. List factors of 36: 1, 2, 3, 4, 6, 9, 12, 18, 36. The greatest common factor is 12.',
    difficulty: 'medium',
    topicId: 'factors'
  },
  {
    id: '36',
    text: 'What is the least common multiple (LCM) of 6 and 8?',
    answer: '24',
    solution: 'List the multiples of 6: 6, 12, 18, 24, 30... List the multiples of 8: 8, 16, 24, 32... The smallest number that appears in both lists is 24.',
    difficulty: 'medium',
    topicId: 'multiples'
  },
  {
    id: '37',
    text: 'If a rectangle has a perimeter of 26 meters and a width of 5 meters, what is its length?',
    answer: '8 \\text{ meters}',
    solution: 'Using the perimeter formula: 2(length + width) = 26. So 2(length + 5) = 26. Divide by 2: length + 5 = 13. Therefore, length = 13 - 5 = 8 meters.',
    difficulty: 'medium',
    topicId: 'geometry'
  },
  {
    id: '38',
    text: 'Round 3.862 to the nearest tenth.',
    answer: '3.9',
    solution: 'Look at the hundredths digit (6). Since it is greater than or equal to 5, round up the tenths digit. So 3.862 rounds to 3.9.',
    difficulty: 'easy',
    topicId: 'decimals'
  },
  {
    id: '39',
    text: 'What is the value of 2³?',
    answer: '8',
    solution: '2³ means 2 multiplied by itself 3 times: 2 × 2 × 2 = 8.',
    difficulty: 'easy',
    topicId: 'exponents'
  },
  {
    id: '40',
    text: 'If 3 pencils cost 75 cents, how much do 7 pencils cost?',
    answer: '$1.75',
    solution: 'Set up a proportion: \\frac{3}{0.75} = \\frac{7}{x}. Cross multiply: 3x = 0.75 × 7 = 5.25. Divide both sides by 3: x = $1.75.',
    difficulty: 'medium',
    topicId: 'ratios'
  },
  {
    id: '41',
    text: 'What is the mean of the first five even numbers?',
    answer: '6',
    solution: 'The first five even numbers are 2, 4, 6, 8, and 10. The mean is (2 + 4 + 6 + 8 + 10) ÷ 5 = 30 ÷ 5 = 6.',
    difficulty: 'medium',
    topicId: 'statistics'
  },
  {
    id: '42',
    text: 'Which is greater: 0.7 or \\frac{3}{4}?',
    answer: '\\frac{3}{4}',
    solution: 'Convert \\frac{3}{4} to a decimal: 3 ÷ 4 = 0.75. Since 0.75 > 0.7, the fraction \\frac{3}{4} is greater.',
    difficulty: 'medium',
    topicId: 'fractions'
  },
  {
    id: '43',
    text: 'Simplify: 3 + 2(4 - 1)',
    answer: '9',
    solution: 'First, calculate within the parentheses: 3 + 2(4 - 1) = 3 + 2(3) = 3 + 6 = 9.',
    difficulty: 'medium',
    topicId: 'operations'
  },
  {
    id: '44',
    text: 'If n = 5, what is the value of 2n + 3?',
    answer: '13',
    solution: 'Substitute n = 5 into the expression: 2n + 3 = 2(5) + 3 = 10 + 3 = 13.',
    difficulty: 'easy',
    topicId: 'algebra'
  },
  {
    id: '45',
    text: 'Find the area of a circle with radius 3 cm. Use π = 3.14.',
    answer: '28.26 \\text{ cm}^2',
    solution: 'The area of a circle is given by the formula: Area = π × r². So Area = 3.14 × 3² = 3.14 × 9 = 28.26 cm².',
    difficulty: 'medium',
    topicId: 'geometry'
  },
  {
    id: '46',
    text: 'Convert 3 hours and 15 minutes to minutes.',
    answer: '195 \\text{ minutes}',
    solution: 'First convert hours to minutes: 3 hours = 3 × 60 = 180 minutes. Then add the additional minutes: 180 + 15 = 195 minutes.',
    difficulty: 'easy',
    topicId: 'measurement'
  },
  {
    id: '47',
    text: 'What is the sum of the interior angles of a pentagon?',
    answer: '540°',
    solution: 'For any polygon with n sides, the sum of interior angles is (n - 2) × 180°. For a pentagon, n = 5, so (5 - 2) × 180° = 3 × 180° = 540°.',
    difficulty: 'hard',
    topicId: 'geometry'
  },
  {
    id: '48',
    text: 'If a car travels 150 miles on 5 gallons of gas, how many miles per gallon does it get?',
    answer: '30 \\text{ miles per gallon}',
    solution: 'Miles per gallon = Total miles ÷ Total gallons = 150 miles ÷ 5 gallons = 30 miles per gallon.',
    difficulty: 'easy',
    topicId: 'ratios'
  },
  {
    id: '49',
    text: 'Simplify: -(-8) + 3',
    answer: '11',
    solution: 'First, simplify the double negative: -(-8) = 8. Then add: 8 + 3 = 11.',
    difficulty: 'medium',
    topicId: 'integers'
  },
  {
    id: '50',
    text: 'What is the probability of rolling an even number on a standard six-sided die?',
    answer: '\\frac{1}{2}',
    solution: 'There are 3 even numbers on a standard die (2, 4, 6) out of 6 possible outcomes. So the probability is \\frac{3}{6} = \\frac{1}{2}.',
    difficulty: 'easy',
    topicId: 'probability'
  }
];

const seedQuizQuestions = async () => {
  for (const question of questions) {
    const params = {
      TableName: 'math_practice_quiz_questions',
      Item: {
        ...question,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
    
    try {
      await docClient.put(params).promise();
      console.log(`Added question: ${question.text}`);
    } catch (err) {
      console.error(`Unable to add question: ${question.text}. Error: ${err}`);
    }
  }
};

seedQuizQuestions().then(() => {
  console.log('Seeding completed!');
}).catch(err => {
  console.error('Error in seeding operation:', err);
});