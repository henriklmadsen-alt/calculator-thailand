import type { APIRoute } from 'astro';
import { categories, calculators } from '../../lib/calculators';
import { CALCULATOR_AFFILIATE_MAP } from '../../data/affiliate-config';

export const prerender = true;

const categoryById = new Map(categories.map((cat) => [cat.id, cat]));
const affiliateHrefSet = new Set(Object.keys(CALCULATOR_AFFILIATE_MAP));

const getCalculatorSearchText = (calc: (typeof calculators)[number]) => {
  const categoryIds = [calc.categoryId, ...(calc.secondaryCategories || [])];
  const categoryText = categoryIds.flatMap((id) => {
    const cat = categoryById.get(id);
    return cat ? [cat.id, cat.name, cat.nameEn, cat.slug, cat.description] : [id];
  });

  return [calc.title, calc.desc, ...categoryText].filter(Boolean).join(' ');
};

const calculatorSearchIndex = calculators.map((calc) => ({
  title: calc.title,
  desc: calc.desc,
  category: calc.categoryId,
  icon: calc.icon,
  href: calc.href,
  searchText: getCalculatorSearchText(calc),
  tag: calc.tag,
  tagColor: calc.tagColor,
  affiliate: affiliateHrefSet.has(calc.href),
}));

export const GET: APIRoute = () => {
  return new Response(JSON.stringify(calculatorSearchIndex), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
};
