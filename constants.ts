
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Product, JournalArticle } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Ek Mukhi Rudraksha',
    tagline: 'The Eye of Shiva.',
    description: 'The rarest of all beads, symbolizing the supreme truth and ultimate consciousness.',
    longDescription: 'The 1 Mukhi Rudraksha (Half Moon shape) is the most auspicious bead, representing Lord Shiva himself. It is said to bring the wearer closer to the divine and fulfill all desires while maintaining detachment. Sourced from the high-altitude forests of the Himalayas, each bead is lab-certified for authenticity and comes with a 925 Silver capping.',
    price: 2450,
    category: 'Home',
    imageUrl: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=1200'
    ],
    features: ['Supreme Consciousness', 'Mental Clarity', 'Abundance & Fortune'],
    mukhi: 1,
    origin: 'Nepal (Himalayan Range)',
    size: '22mm - 25mm',
    vibration: '963 Hz (Crown Chakra)',
    certification: 'ISO 9001:2015 Certified Lab',
    stock: 2
  },
  {
    id: 'p2',
    name: 'Gauri Shankar Mala',
    tagline: 'Unity of Two.',
    description: 'Two naturally joined beads representing the union of Shiva and Shakti.',
    longDescription: 'Gauri Shankar is a rare biological phenomenon where two Rudraksha beads grow together naturally. It symbolizes the divine balance of masculine and feminine energies (Ardhanarishwara). It is highly recommended for improving relationships, bringing peace within the household, and balancing internal energies.',
    price: 899,
    category: 'Wearable',
    imageUrl: 'https://images.unsplash.com/photo-1590059501538-4e3188562772?auto=format&fit=crop&q=80&w=1200',
    gallery: [
        'https://images.unsplash.com/photo-1614035654394-4696120409a3?auto=format&fit=crop&q=80&w=1200'
    ],
    features: ['Relationship Harmony', 'Inner Balance', 'Psychic Awakening'],
    mukhi: 2,
    origin: 'Nepal',
    size: '28mm',
    vibration: '639 Hz (Heart Chakra)',
    certification: 'Rudraksha Research Institute',
    stock: 8
  },
  {
    id: 'p3',
    name: 'Pancha Mukhi Japa Mala',
    tagline: 'The Five Elements.',
    description: 'A traditional 108+1 bead mala for daily meditation and spiritual grounding.',
    longDescription: 'The 5 Mukhi Rudraksha is governed by Kalagni Rudra and is the most powerful bead for general health and blood pressure regulation. Our Japa Malas are meticulously hand-knotted with traditional saffron tassels. Each bead is selected for its uniform size and deep mukhi lines, ensuring a rhythmic counting experience.',
    price: 125,
    category: 'Audio',
    imageUrl: 'https://images.unsplash.com/photo-1542360663-8034a7062c55?auto=format&fit=crop&q=80&w=1200',
    gallery: [
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1200'
    ],
    features: ['Blood Pressure Regulation', 'Stress Relief', 'Mantra Focus'],
    mukhi: 5,
    origin: 'Java, Indonesia',
    size: '8mm',
    vibration: '528 Hz (Solar Plexus)',
    certification: 'Authenticated Natural Seed',
    stock: 50
  },
  {
    id: 'p4',
    name: 'Surya 12 Mukhi Bead',
    tagline: 'Solar Radiance.',
    description: 'A powerful bead for leadership, self-confidence, and vitality.',
    longDescription: 'Representing the 12 Adityas (Suns), the 12 Mukhi Rudraksha for those who seek power and authority. It dispels fear and provides the wearer with the radiance of the sun. It is particularly beneficial for professionals, leaders, and those suffering from low confidence.',
    price: 549,
    category: 'Wearable',
    imageUrl: 'https://images.unsplash.com/photo-1614035654394-4696120409a3?auto=format&fit=crop&q=80&w=1200',
    gallery: [],
    features: ['Leadership Ability', 'Radiant Energy', 'Fearlessness'],
    mukhi: 12,
    origin: 'Nepal',
    size: '18mm',
    vibration: '126.22 Hz (Sun Frequency)',
    certification: 'X-Ray Verified',
    stock: 4
  },
  {
    id: 'p5',
    name: 'Rudraksha Silver Bracelet',
    tagline: 'Sacred Protection.',
    description: 'A modern design featuring 5 Mukhi beads encased in pure 925 Sterling Silver.',
    longDescription: 'Crafted for the modern seeker, this bracelet combines the ancient power of Rudraksha with the elegance of sterling silver. It acts as a protective shield against negative energies while maintaining a sophisticated aesthetic. Perfect for daily wear in professional environments.',
    price: 299,
    category: 'Wearable',
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1200',
    gallery: [],
    features: ['Energy Shield', 'Sterling Silver', 'Adjustable Fit'],
    mukhi: 5,
    origin: 'Indonesian Origin Beads',
    size: 'Adjustable',
    vibration: 'Neutralizing Static',
    certification: 'Silver Purity Hallmarked',
    stock: 12
  },
  {
    id: 'p6',
    name: 'Siddh Mala',
    tagline: 'Ultimate Alchemy.',
    description: 'The most powerful combination of 1 to 14 Mukhi beads for complete life transformation.',
    longDescription: 'The Siddh Mala is a masterpiece of spiritual engineering. It contains a collection of beads from 1 Mukhi to 14 Mukhi, Gaurishankar, and Ganesh Rudraksha. It is designed to balance all the chakras, protect the wearer from all directions, and accelerate spiritual growth exponentially.',
    price: 4500,
    category: 'Home',
    imageUrl: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=1200',
    gallery: [],
    features: ['Full Chakra Alignment', 'Spiritual Mastery', 'Universal Protection'],
    mukhi: '1-14 Complex',
    origin: 'Premium Nepalese Collection',
    size: 'Full Length',
    vibration: 'Complete Spectrum',
    certification: 'Individual X-Ray Report for each Bead',
    stock: 1
  }
];

export const JOURNAL_ARTICLES: JournalArticle[] = [
    {
        id: 1,
        title: "The Legend of Aksha",
        date: "April 12, 2025",
        excerpt: "Discover the mythological origins of the seeds that fell from the eyes of Shiva.",
        image: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=1000",
        content: React.createElement(React.Fragment, null,
            React.createElement("p", { className: "mb-6 first-letter:text-5xl first-letter:font-serif first-letter:mr-3 first-letter:float-left text-[#5D5A53]" },
                "Legend has it that Lord Shiva once went into a deep state of meditation for the well-being of all living creatures. When he opened his eyes, tears of compassion fell to the earth, giving birth to the Rudraksha trees."
            ),
            React.createElement("p", { className: "mb-8 text-[#5D5A53]" },
                "These seeds are not merely botanical specimens; they are biological storage devices for high-frequency energy. They have been used for millennia by yogis and householders alike to maintain health and spiritual focus."
            ),
            React.createElement("blockquote", { className: "border-l-2 border-[#2C2A26] pl-6 italic text-xl text-[#2C2A26] my-10 font-serif" },
                "\"Rudra-Aksha: The teardrops of the Destroyer, the seeds of the Creator.\""
            ),
            React.createElement("p", { className: "mb-6 text-[#5D5A53]" },
                "At Raksham, we honor this ancient heritage. Each bead is treated with the sanctity it deserves, ensuring that its spiritual potency remains intact from the Himalayan heights to your hand."
            )
        )
    },
    {
        id: 2,
        title: "Science of the Sacred",
        date: "March 28, 2025",
        excerpt: "Exploring the electromagnetic properties of Rudraksha beads and their effect on the human heart.",
        image: "https://images.unsplash.com/photo-1518005020251-58296d87e39d?auto=format&fit=crop&q=80&w=1000",
        content: React.createElement(React.Fragment, null,
            React.createElement("p", { className: "mb-6 text-[#5D5A53]" },
                "Beyond mythology, modern bio-medical research has begun to uncover why Rudraksha beads have such a calming effect. They possess unique electromagnetic, inductive, and capacitive properties."
            ),
            React.createElement("p", { className: "mb-8 text-[#5D5A53]" },
                "\"The beads act as a natural stabilizer for the human bio-electric field,\" says Dr. V.K. Shastry. \"By influencing the heart rate and blood pressure through inductive coupling, they provide a physiological basis for the peace reported by meditators.\""
            ),
            React.createElement("div", { className: "my-12 p-8 bg-[#EBE7DE] font-serif text-[#2C2A26] italic text-center" },
                React.createElement("p", null, "Vibration meets biology"),
                React.createElement("p", null, "A resonance of the ancient"),
                React.createElement("p", null, "The heart beats in rhythm"),
                React.createElement("p", null, "With the pulse of the Earth.")
            ),
            React.createElement("p", { className: "mb-6 text-[#5D5A53]" },
                "This convergence of science and spirituality is at the heart of our curation process. We select beads not just for their appearance, but for their energetic resonance."
            )
        )
    },
    {
        id: 3,
        title: "Mantra & Mala",
        date: "March 15, 2025",
        excerpt: "The art of Japa: How to choose and use your meditation beads correctly.",
        image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=1000",
        content: React.createElement(React.Fragment, null,
            React.createElement("p", { className: "mb-6 text-[#5D5A53]" },
                "Choosing a mala is an intuitive process. It is said that the bead chooses the wearer, not the other way around. Whether you are drawn to the 5 Mukhi for peace or the 1 Mukhi for focus, the connection is personal."
            ),
            React.createElement("p", { className: "mb-8 text-[#5D5A53]" },
                "When practicing Japa, the mala should be held with the middle finger and thumb. The index finger, representing the ego, should never touch the sacred beads. This practice helps in transcending the self."
            ),
             React.createElement("div", { className: "my-12 p-8 bg-[#2C2A26] text-[#F5F2EB] font-serif italic text-center" },
                React.createElement("p", null, "AUM NAMAH SHIVAYA"),
                React.createElement("p", null, "108 turns of the wheel"),
                React.createElement("p", null, "Silence remains.")
            )
        )
    }
];

export const BRAND_NAME = 'Raksham';
export const PRIMARY_COLOR = 'amber-900'; 
export const ACCENT_COLOR = 'orange-600';
