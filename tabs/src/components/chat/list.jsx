import * as React from 'react';
import { Box, List, Image } from '@fluentui/react-northstar';

const items = [
  {
    key: 'robert',
    media: <Image src="https://fabricweb.azureedge.net/fabric-website/assets/images/avatar/RobertTolbert.jpg" avatar />,
    header: <b>Robert Tolbert</b>,
    headerMedia: '7:26:56 AM',
    content: 'Program the sensor to the SAS alarm through the haptic SQL card!',
  }
];

const ListExampleSelectable = () => (
  <Box
    styles={({ theme: { siteVariables } }) => ({
      backgroundColor: siteVariables.colorScheme.default.background4,
    })}
  >
    <List selectable defaultSelectedIndex={0} items={items} />
  </Box>
);

export default ListExampleSelectable;