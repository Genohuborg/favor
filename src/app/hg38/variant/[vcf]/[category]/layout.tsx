import { VariantHeader } from "@features/variant/components/header/variant-header";
import { variantDataChecks } from "@features/variant/config/hg38/data-availability";
import { VARIANT_NAVIGATION_CONFIG } from "@features/variant/config/hg38/navigation";
import { fetchTabAvailability } from "@features/variant/utils/fetch-tab-availability";
import { fetchVariantWithCookie } from "@features/variant/utils/fetch-with-cookie";
import { MobileSubNavigation } from "@shared/components/navigation/mobile-sub-navigation";
import { NavigationSidebar } from "@shared/components/navigation/navigation-sidebar";
import { NavigationTabs } from "@shared/components/navigation/navigation-tabs";
import { getDisabledSlugs } from "@shared/utils/data-availability";
import { notFound } from "next/navigation";

interface VariantLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    vcf: string;
    category: string;
  }>;
}

export default async function VariantLayout({
  children,
  params,
}: VariantLayoutProps) {
  const { vcf, category } = await params;

  const currentCategory = VARIANT_NAVIGATION_CONFIG.find(
    (cat) => cat.slug === category,
  );

  if (!currentCategory) {
    notFound();
  }

  const result = await fetchVariantWithCookie(vcf);

  if (!result) {
    notFound();
  }

  // Tab-availability hits the graph + GWAS endpoints for the four graph-backed
  // tabs (credible-sets, l2g-scores, pharmacogenomics, gwas-catalog). Those
  // endpoints need the canonical VCF: the [vcf] route param may be an rsID
  // (e.g. "rs7412") that /graph/Variant/{id} rejects, so resolve it from the
  // variant payload first instead of passing the raw param.
  const externalDisabledSlugs = await fetchTabAvailability(
    result.selected.variant_vcf,
  ).catch(() => [] as string[]);

  const disabledSlugs = [
    ...getDisabledSlugs(result.selected, variantDataChecks),
    ...externalDisabledSlugs,
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-background">
        <div className="max-w-page mx-auto px-6 lg:px-12">
          <VariantHeader result={result} />

          <div className="hidden lg:block mb-6">
            <NavigationTabs
              items={VARIANT_NAVIGATION_CONFIG.map((cat) => ({
                name: cat.name,
                slug: cat.slug,
                hasSubCategories: cat.subCategories.length > 0,
                defaultSubCategory:
                  cat.subCategories.length > 0
                    ? cat.subCategories[0].slug
                    : undefined,
              }))}
              activeItem={category}
              basePath={`/hg38/variant/${encodeURIComponent(vcf)}`}
              disabledSlugs={disabledSlugs}
            />
          </div>

          {currentCategory.subCategories.length > 0 && (
            <div className="mb-6 lg:hidden">
              <MobileSubNavigation
                items={currentCategory.subCategories}
                basePath={`/hg38/variant/${encodeURIComponent(vcf)}/${category}`}
                disabledSlugs={disabledSlugs}
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Content Section */}
      <div className="max-w-page mx-auto px-6 lg:px-12 pb-12">
        <div className="flex gap-6">
          {(currentCategory.groups ||
            currentCategory.subCategories.length > 0) && (
            <NavigationSidebar
              items={currentCategory.subCategories}
              groups={currentCategory.groups}
              basePath={`/hg38/variant/${encodeURIComponent(vcf)}/${category}`}
              showIcons={currentCategory.showIcons}
              disabledSlugs={disabledSlugs}
            />
          )}

          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
