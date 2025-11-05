import { m } from 'framer-motion';
// @mui
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
// components
import { RouterLink } from 'src/routes/components';
import { MotionContainer, varFade } from 'src/components/animate';
import { paths } from 'src/routes/paths';
// sections
import KYCTitle from './kyc-title';
import KYCFooter from './kyc-footer';

// ----------------------------------------------------------------------

export default function KYCCompanyDetails() {
  return (
    <Container>
      <KYCTitle
        title="Company Details"
        subtitle={
          'Kindly submit your company’s key documents, such as the Memorandum of Association (MoA) and Articles of Association (AoA). These documents are necessary for verification of your company’s legal existence and compliance with applicable regulations'
        }
      />

      <KYCFooter />
    </Container>
  );
}
