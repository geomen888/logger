import React from 'react';
import styled from 'styled-components';

import { Container, Flex } from 'styled-minimal';

const FooterWrapper = styled.footer`
  border-top: 0.1rem solid #ddd;
`;

const Footer = () => (
  <FooterWrapper>
    CSV FILE UPLOADER
  </FooterWrapper>
);

export default Footer;
