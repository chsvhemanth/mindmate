import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Therapist from '../src/models/Therapist.js';
import connectDB from '../src/config/database.js';

dotenv.config();

// Sample therapist data with coordinates
// Coordinates format: [longitude, latitude] for major cities
const sampleTherapists = [
  // New York City area therapists
  {
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@therapy.com",
    phone: "+1-212-555-0101",
    specialization: ["anxiety", "depression", "stress"],
    experience: 12,
    location: {
      address: "123 Park Avenue, Suite 400",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      coordinates: {
        type: "Point",
        coordinates: [-73.9712, 40.7831] // Central Park area
      }
    },
    rate: 150,
    bio: "Licensed clinical psychologist with over 12 years of experience helping individuals overcome anxiety and depression. Specializes in CBT and mindfulness-based approaches.",
    qualifications: ["PhD in Clinical Psychology", "Licensed Clinical Psychologist", "CBT Certified"],
    languages: ["English", "Spanish"],
    isAvailable: true,
    rating: 4.8,
    reviewCount: 127
  },
  {
    name: "Dr. Michael Chen",
    email: "michael.chen@therapy.com",
    phone: "+1-212-555-0102",
    specialization: ["trauma", "ptsd", "relationships"],
    experience: 15,
    location: {
      address: "456 Broadway, Floor 5",
      city: "New York",
      state: "NY",
      zipCode: "10013",
      coordinates: {
        type: "Point",
        coordinates: [-74.0060, 40.7128] // Lower Manhattan
      }
    },
    rate: 175,
    bio: "Trauma-informed therapist specializing in PTSD and relationship counseling. EMDR certified with extensive experience in helping clients heal from trauma.",
    qualifications: ["LCSW", "EMDR Certified", "Trauma-Informed Care Specialist"],
    languages: ["English", "Mandarin"],
    isAvailable: true,
    rating: 4.9,
    reviewCount: 203
  },
  {
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@therapy.com",
    phone: "+1-212-555-0103",
    specialization: ["relationships", "stress", "general"],
    experience: 8,
    location: {
      address: "789 Lexington Avenue, Suite 200",
      city: "New York",
      state: "NY",
      zipCode: "10022",
      coordinates: {
        type: "Point",
        coordinates: [-73.9712, 40.7580] // Upper East Side
      }
    },
    rate: 140,
    bio: "Warm and empathetic therapist focused on helping individuals navigate relationship challenges and life transitions. Uses an integrative approach combining psychodynamic and solution-focused therapy.",
    qualifications: ["LMFT", "Gottman Method Certified"],
    languages: ["English", "Spanish"],
    isAvailable: true,
    rating: 4.7,
    reviewCount: 89
  },
  {
    name: "Dr. James Wilson",
    email: "james.wilson@therapy.com",
    phone: "+1-212-555-0104",
    specialization: ["addiction", "depression", "anxiety"],
    experience: 20,
    location: {
      address: "321 West 57th Street, Suite 600",
      city: "New York",
      state: "NY",
      zipCode: "10019",
      coordinates: {
        type: "Point",
        coordinates: [-73.9772, 40.7648] // Midtown West
      }
    },
    rate: 200,
    bio: "Experienced addiction counselor and mental health therapist. Specializes in substance use disorders, dual diagnosis, and helping individuals build sustainable recovery.",
    qualifications: ["LADC", "Licensed Professional Counselor", "Substance Abuse Specialist"],
    languages: ["English"],
    isAvailable: true,
    rating: 4.9,
    reviewCount: 312
  },
  {
    name: "Dr. Lisa Thompson",
    email: "lisa.thompson@therapy.com",
    phone: "+1-212-555-0105",
    specialization: ["grief", "depression", "stress"],
    experience: 10,
    location: {
      address: "654 Madison Avenue, Suite 300",
      city: "New York",
      state: "NY",
      zipCode: "10065",
      coordinates: {
        type: "Point",
        coordinates: [-73.9712, 40.7681] // Upper East Side
      }
    },
    rate: 160,
    bio: "Compassionate grief counselor and therapist specializing in loss, bereavement, and life transitions. Creates a safe space for healing and growth.",
    qualifications: ["LCSW", "Grief Counseling Certified", "Thanatology Specialist"],
    languages: ["English"],
    isAvailable: true,
    rating: 4.8,
    reviewCount: 156
  },
  // Los Angeles area therapists
  {
    name: "Dr. Maria Garcia",
    email: "maria.garcia@therapy.com",
    phone: "+1-310-555-0201",
    specialization: ["anxiety", "stress", "relationships"],
    experience: 11,
    location: {
      address: "123 Sunset Boulevard, Suite 500",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90028",
      coordinates: {
        type: "Point",
        coordinates: [-118.3269, 34.0983] // Hollywood area
      }
    },
    rate: 145,
    bio: "Bilingual therapist serving the LA community. Specializes in anxiety management, stress reduction, and helping individuals build healthier relationships.",
    qualifications: ["LMFT", "Bilingual Therapist", "Anxiety Specialist"],
    languages: ["English", "Spanish"],
    isAvailable: true,
    rating: 4.7,
    reviewCount: 134
  },
  {
    name: "Dr. Robert Kim",
    email: "robert.kim@therapy.com",
    phone: "+1-310-555-0202",
    specialization: ["depression", "anxiety", "general"],
    experience: 9,
    location: {
      address: "456 Wilshire Boulevard, Floor 8",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90010",
      coordinates: {
        type: "Point",
        coordinates: [-118.2987, 34.0522] // Downtown LA
      }
    },
    rate: 155,
    bio: "Dedicated therapist focused on helping individuals overcome depression and anxiety. Uses evidence-based approaches including CBT and DBT.",
    qualifications: ["LCSW", "CBT Certified", "DBT Trained"],
    languages: ["English", "Korean"],
    isAvailable: true,
    rating: 4.6,
    reviewCount: 98
  },
  {
    name: "Dr. Jennifer Martinez",
    email: "jennifer.martinez@therapy.com",
    phone: "+1-310-555-0203",
    specialization: ["trauma", "ptsd", "anxiety"],
    experience: 13,
    location: {
      address: "789 Santa Monica Boulevard, Suite 200",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90046",
      coordinates: {
        type: "Point",
        coordinates: [-118.3617, 34.0928] // West Hollywood
      }
    },
    rate: 170,
    bio: "Trauma specialist with extensive training in EMDR and somatic experiencing. Helps clients process and heal from traumatic experiences.",
    qualifications: ["LCSW", "EMDR Certified", "Somatic Experiencing Practitioner"],
    languages: ["English", "Spanish"],
    isAvailable: true,
    rating: 4.9,
    reviewCount: 187
  },
  {
    name: "Dr. David Lee",
    email: "david.lee@therapy.com",
    phone: "+1-310-555-0204",
    specialization: ["relationships", "stress", "general"],
    experience: 7,
    location: {
      address: "321 Beverly Drive, Suite 150",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
      coordinates: {
        type: "Point",
        coordinates: [-118.4004, 34.0736] // Beverly Hills
      }
    },
    rate: 180,
    bio: "Relationship therapist helping couples and individuals build stronger connections. Specializes in communication skills and conflict resolution.",
    qualifications: ["LMFT", "Gottman Method Level 2", "Emotionally Focused Therapy"],
    languages: ["English"],
    isAvailable: true,
    rating: 4.8,
    reviewCount: 112
  },
  {
    name: "Dr. Amanda White",
    email: "amanda.white@therapy.com",
    phone: "+1-310-555-0205",
    specialization: ["eating-disorders", "anxiety", "depression"],
    experience: 14,
    location: {
      address: "654 Melrose Avenue, Suite 400",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90038",
      coordinates: {
        type: "Point",
        coordinates: [-118.3287, 34.0837] // Mid-Wilshire
      }
    },
    rate: 165,
    bio: "Specialized therapist focusing on eating disorders, body image, and related anxiety and depression. Creates a supportive environment for recovery.",
    qualifications: ["LCSW", "Eating Disorder Specialist", "Certified Intuitive Eating Counselor"],
    languages: ["English"],
    isAvailable: true,
    rating: 4.7,
    reviewCount: 145
  },
  // Chicago area therapists
  {
    name: "Dr. Patricia Brown",
    email: "patricia.brown@therapy.com",
    phone: "+1-312-555-0301",
    specialization: ["depression", "anxiety", "grief"],
    experience: 16,
    location: {
      address: "123 Michigan Avenue, Suite 600",
      city: "Chicago",
      state: "IL",
      zipCode: "60611",
      coordinates: {
        type: "Point",
        coordinates: [-87.6298, 41.8781] // Downtown Chicago
      }
    },
    rate: 150,
    bio: "Experienced therapist providing compassionate care for depression, anxiety, and grief. Uses an integrative approach tailored to each client's needs.",
    qualifications: ["LCPC", "Grief Counseling Specialist", "CBT Certified"],
    languages: ["English"],
    isAvailable: true,
    rating: 4.8,
    reviewCount: 201
  },
  {
    name: "Dr. Christopher Taylor",
    email: "christopher.taylor@therapy.com",
    phone: "+1-312-555-0302",
    specialization: ["addiction", "trauma", "ptsd"],
    experience: 18,
    location: {
      address: "456 North State Street, Floor 12",
      city: "Chicago",
      state: "IL",
      zipCode: "60654",
      coordinates: {
        type: "Point",
        coordinates: [-87.6277, 41.8902] // River North
      }
    },
    rate: 175,
    bio: "Dual-diagnosis specialist helping individuals recover from addiction and trauma. Combines evidence-based treatments with compassionate care.",
    qualifications: ["LCSW", "CADC", "Trauma-Informed Care", "EMDR Certified"],
    languages: ["English"],
    isAvailable: true,
    rating: 4.9,
    reviewCount: 267
  },
  {
    name: "Dr. Nicole Anderson",
    email: "nicole.anderson@therapy.com",
    phone: "+1-312-555-0303",
    specialization: ["relationships", "stress", "anxiety"],
    experience: 10,
    location: {
      address: "789 West Diversey Parkway, Suite 300",
      city: "Chicago",
      state: "IL",
      zipCode: "60614",
      coordinates: {
        type: "Point",
        coordinates: [-87.6536, 41.9326] // Lincoln Park
      }
    },
    rate: 145,
    bio: "Relationship and stress management therapist. Helps individuals and couples navigate life's challenges with practical tools and emotional support.",
    qualifications: ["LMFT", "Stress Management Specialist", "Mindfulness-Based Therapy"],
    languages: ["English"],
    isAvailable: true,
    rating: 4.6,
    reviewCount: 123
  },
  {
    name: "Dr. Mark Johnson",
    email: "mark.johnson@therapy.com",
    phone: "+1-312-555-0304",
    specialization: ["ocd", "anxiety", "stress"],
    experience: 12,
    location: {
      address: "321 South Wabash Avenue, Suite 500",
      city: "Chicago",
      state: "IL",
      zipCode: "60604",
      coordinates: {
        type: "Point",
        coordinates: [-87.6244, 41.8781] // Loop area
      }
    },
    rate: 160,
    bio: "OCD and anxiety specialist using Exposure and Response Prevention (ERP) therapy. Helps clients overcome obsessive-compulsive patterns and anxiety.",
    qualifications: ["LCPC", "OCD Specialist", "ERP Certified", "Anxiety Disorders Expert"],
    languages: ["English"],
    isAvailable: true,
    rating: 4.8,
    reviewCount: 178
  },
  {
    name: "Dr. Rachel Green",
    email: "rachel.green@therapy.com",
    phone: "+1-312-555-0305",
    specialization: ["depression", "relationships", "general"],
    experience: 8,
    location: {
      address: "654 North Clark Street, Suite 200",
      city: "Chicago",
      state: "IL",
      zipCode: "60654",
      coordinates: {
        type: "Point",
        coordinates: [-87.6310, 41.8956] // Gold Coast
      }
    },
    rate: 140,
    bio: "Warm and approachable therapist specializing in depression and relationship issues. Creates a safe, non-judgmental space for healing and growth.",
    qualifications: ["LCSW", "Interpersonal Therapy Certified"],
    languages: ["English"],
    isAvailable: true,
    rating: 4.7,
    reviewCount: 95
  },
  // Seattle area therapists
  {
    name: "Dr. Kevin Park",
    email: "kevin.park@therapy.com",
    phone: "+1-206-555-0401",
    specialization: ["anxiety", "stress", "general"],
    experience: 11,
    location: {
      address: "123 Pike Street, Suite 400",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      coordinates: {
        type: "Point",
        coordinates: [-122.3321, 47.6062] // Downtown Seattle
      }
    },
    rate: 150,
    bio: "Mindfulness-based therapist helping individuals manage anxiety and stress. Integrates meditation, breathing techniques, and cognitive strategies.",
    qualifications: ["LMHC", "Mindfulness-Based Stress Reduction (MBSR) Certified"],
    languages: ["English", "Korean"],
    isAvailable: true,
    rating: 4.7,
    reviewCount: 142
  },
  {
    name: "Dr. Michelle Davis",
    email: "michelle.davis@therapy.com",
    phone: "+1-206-555-0402",
    specialization: ["trauma", "ptsd", "anxiety"],
    experience: 15,
    location: {
      address: "456 University Street, Floor 6",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      coordinates: {
        type: "Point",
        coordinates: [-122.3352, 47.6085] // Downtown
      }
    },
    rate: 170,
    bio: "Trauma therapist with expertise in PTSD treatment. Uses EMDR, somatic therapy, and other evidence-based approaches to help clients heal.",
    qualifications: ["LCSW", "EMDR Certified", "Somatic Experiencing Practitioner"],
    languages: ["English"],
    isAvailable: true,
    rating: 4.9,
    reviewCount: 198
  },
  {
    name: "Dr. Steven Miller",
    email: "steven.miller@therapy.com",
    phone: "+1-206-555-0403",
    specialization: ["depression", "grief", "relationships"],
    experience: 13,
    location: {
      address: "789 Broadway East, Suite 250",
      city: "Seattle",
      state: "WA",
      zipCode: "98102",
      coordinates: {
        type: "Point",
        coordinates: [-122.3207, 47.6205] // Capitol Hill
      }
    },
    rate: 155,
    bio: "Compassionate therapist specializing in depression, grief, and relationship counseling. Helps clients find meaning and connection in their lives.",
    qualifications: ["LMFT", "Grief Counseling Specialist", "Existential Therapy"],
    languages: ["English"],
    isAvailable: true,
    rating: 4.8,
    reviewCount: 167
  },
  {
    name: "Dr. Laura Smith",
    email: "laura.smith@therapy.com",
    phone: "+1-206-555-0404",
    specialization: ["relationships", "stress", "anxiety"],
    experience: 9,
    location: {
      address: "321 Queen Anne Avenue North, Suite 300",
      city: "Seattle",
      state: "WA",
      zipCode: "98109",
      coordinates: {
        type: "Point",
        coordinates: [-122.3567, 47.6274] // Queen Anne
      }
    },
    rate: 145,
    bio: "Relationship therapist helping couples and individuals build stronger connections. Specializes in communication and emotional intimacy.",
    qualifications: ["LMFT", "Gottman Method Certified", "Emotionally Focused Therapy"],
    languages: ["English"],
    isAvailable: true,
    rating: 4.6,
    reviewCount: 108
  },
  {
    name: "Dr. Brian Wilson",
    email: "brian.wilson@therapy.com",
    phone: "+1-206-555-0405",
    specialization: ["addiction", "depression", "anxiety"],
    experience: 17,
    location: {
      address: "654 Westlake Avenue North, Suite 500",
      city: "Seattle",
      state: "WA",
      zipCode: "98109",
      coordinates: {
        type: "Point",
        coordinates: [-122.3394, 47.6205] // South Lake Union
      }
    },
    rate: 165,
    bio: "Addiction counselor and mental health therapist. Specializes in substance use disorders and co-occurring mental health conditions.",
    qualifications: ["LADC", "Licensed Mental Health Counselor", "Substance Abuse Specialist"],
    languages: ["English"],
    isAvailable: true,
    rating: 4.8,
    reviewCount: 234
  }
];

async function seedTherapists() {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to MongoDB');

    // Check if therapists already exist
    const existingTherapists = await Therapist.countDocuments();
    if (existingTherapists > 0) {
      console.log(`Found ${existingTherapists} existing therapists.`);
      console.log('Deleting existing therapists and creating new ones...');
      await Therapist.deleteMany({});
    }

    // Create therapists
    const createdTherapists = await Therapist.insertMany(sampleTherapists);
    console.log(`✅ Successfully created ${createdTherapists.length} therapists!`);

    // Display summary by city
    const cityCounts = {};
    const specializationCounts = {};
    
    createdTherapists.forEach(therapist => {
      const city = therapist.location.city;
      cityCounts[city] = (cityCounts[city] || 0) + 1;
      
      therapist.specialization.forEach(spec => {
        specializationCounts[spec] = (specializationCounts[spec] || 0) + 1;
      });
    });

    console.log('\n📊 Therapist Summary by City:');
    Object.entries(cityCounts).forEach(([city, count]) => {
      console.log(`   ${city}: ${count} therapists`);
    });

    console.log('\n📊 Specialization Summary:');
    Object.entries(specializationCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([spec, count]) => {
        console.log(`   ${spec}: ${count}`);
      });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding therapists:', error);
    process.exit(1);
  }
}

// Run the seed function
seedTherapists();

