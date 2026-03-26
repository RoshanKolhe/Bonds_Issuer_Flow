import { useMemo } from 'react';
// routes
import { paths } from 'src/routes/paths';
// locales
import { useLocales } from 'src/locales';
// components
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  company: icon('ic_label'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  intermediate: icon('ic_intermediate'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  bonds: icon('ic_bonds'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  signatories: icon('ic_signatories'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useLocales();

  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: t('overview'),
        items: [
          { title: t('Dashboard'), path: paths.dashboard.general.analytics, icon: ICONS.dashboard },
        ],
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: t('management'),
        items: [
          // COMPANY
          {
            title: t('issuer services'),
            path: paths.dashboard.issureservices.root,
            icon: ICONS.company,
            children: [
              { title: t('Bond Estimation'), path: paths.dashboard.issureservices.roi },
              { title: t('Document Drafting'), path: paths.dashboard.documentDrafting.list },
            ],
          },

          //   {
          //   title: t('intermediates'),
          //   path: paths.dashboard.trustee.root,
          //   icon: ICONS.intermediate,
          //   children: [
          //     { title: t('Debenture Trustees'), path: paths.dashboard.trustee.list },
          //   ],

          // },
          {
            title: t('my bonds'),
            path: paths.dashboard.mybond.root,
            icon: ICONS.bonds,
          },
          {
            title: t('signatories'),
            path: paths.dashboard.signatories.root,
            icon: ICONS.signatories,
            children: [
              { title: t('list'), path: paths.dashboard.signatories.list },
              { title: t('create'), path: paths.dashboard.signatories.new },
            ],
          },
          {
            title: t('ubo'),
            path: paths.dashboard.ubo.root,
            icon: ICONS.label,
            children: [
              { title: t('list'), path: paths.dashboard.ubo.list },
              { title: t('create'), path: paths.dashboard.ubo.new },
            ],
          }
        ],
      },
    ],
    [t]
  );

  return data;
}


