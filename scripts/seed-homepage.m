/**
 * Seed Homepage Sections and fix missing data
 */
import{createClient} from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import{fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({path : path.join(__dirname, '..', '.env.local')});

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,
                              process.env.SUPABASE_SERVICE_ROLE_KEY);

async function seed() {
  console.log('🚀 Seeding homepage sections...\n');

  // Get or create homepage config
  let{data : config} =
      await supabase.from('homepage_config').select('*').single();

  if (!config) {
    const {data : newConfig, error} = await supabase.from('homepage_config')
                                          .insert({
                                            featured_product_ids : [],
                                            featured_products_count : 8,
                                            stats : {
                                              yearsExperience : 15,
                                              satisfiedClients : 500,
                                              partsAvailable : 5000,
                                              onTimeDelivery : 98
                                            },
                                            hero_title : '',
                                            hero_subtitle : '',
                                            updated_by : 'system'
                                          })
                                          .select()
                                          .single();

    if (error) {
      console.error('❌ Create config failed:', error.message);
      return;
    }
    config = newConfig;
    console.log('✅ Created homepage config');
  } else {
    console.log('✅ Found homepage config:', config.id);
  }

  // Delete old sections
  await supabase.from('homepage_sections').delete().eq('config_id', config.id);
  await supabase.from('homepage_testimonials')
      .delete()
      .eq('config_id', config.id);

  // Insert ALL sections including the new "recent_stock" section
  const sections = [
    {
      section_id : 'hero',
      label : 'Hero Banner',
      visible : true,
      sort_order : 0
    },
    {
      section_id : 'brands',
      label : 'Brand Strip',
      visible : true,
      sort_order : 1
    },
    {
      section_id : 'stats',
      label : 'Statistics',
      visible : true,
      sort_order : 2
    },
    {
      section_id : 'features',
      label : 'Features Grid',
      visible : true,
      sort_order : 3
    },
    {
      section_id : 'categories',
      label : 'Categories',
      visible : true,
      sort_order : 4
    },
    {
      section_id : 'featured_products',
      label : 'Featured Products',
      visible : true,
      sort_order : 5
    },
    {
      section_id : 'recent_stock',
      label : 'Recent Stock Updates',
      visible : true,
      sort_order : 6
    },
    {
      section_id : 'parts_console',
      label : 'Parts Intelligence Console',
      visible : true,
      sort_order : 7
    },
    {
      section_id : 'story',
      label : 'Company Story',
      visible : true,
      sort_order : 8
    },
    {
      section_id : 'testimonials',
      label : 'Testimonials',
      visible : true,
      sort_order : 9
    },
    {
      section_id : 'cta',
      label : 'Call to Action',
      visible : true,
      sort_order : 10
    },
    {
      section_id : 'articles',
      label : 'Featured Articles',
      visible : true,
      sort_order : 11
    },
    {
      section_id : 'faq',
      label : 'FAQ Section',
      visible : true,
      sort_order : 12
    },
  ];

  const {error : secError} =
      await supabase.from('homepage_sections')
          .insert(sections.map(s = > ({... s, config_id : config.id})));

  if (secError) {
    console.error('❌ Sections insert failed:', secError.message);
    return;
  }
  console.log(`✅ Inserted ${sections.length} sections(
      including "Recent Stock Updates")`);

  // Insert testimonials
  const testimonials = [
    {
      quote :
          'Saudi Horizon provided exceptional service in sourcing hard-to-find parts for our heavy machinery fleet. Their delivery speed minimized our downtime significantly.',
      author : 'Fahad Al-Otaibi',
      role : 'Operations Director',
      company : 'Al-Otaibi Construction',
      is_active : true
    },
    {
      quote :
          'The quality of the refurbished equipment we purchased was outstanding. It performs like new but at a fraction of the cost. Highly recommended partner.',
      author : 'John Smith',
      role : 'Fleet Manager',
      company : 'Global Logistics Co.',
      is_active : true
    },
    {
      quote :
          'Their technical support team went above and beyond to help us identify the correct components for our vintage Caterpillar generators.',
      author : 'Mohammed Asghar',
      role : 'Chief Engineer',
      company : 'Power Systems Ltd.',
      is_active : true
    },
  ];

  const {error : testError} =
      await supabase.from('homepage_testimonials')
          .insert(testimonials.map(t = > ({... t, config_id : config.id})));

  if (testError) {
    console.error('❌ Testimonials insert failed:', testError.message);
    return;
  }
  console.log(`✅ Inserted ${testimonials.length} testimonials`);

  // Verify
  const {data : checkSections} =
      await supabase.from('homepage_sections')
          .select('section_id, label, visible, sort_order')
          .eq('config_id', config.id)
          .order('sort_order');
  console.log('\n📋 Sections now in database:');
  checkSections ?.forEach(s = > console.log(` [${s.sort_order}] $ {
                   s.section_id
                 } — ${s.label}(visible : ${s.visible})`));

  console.log('\n🎉 Homepage fully seeded!');
}

seed().catch(console.error);