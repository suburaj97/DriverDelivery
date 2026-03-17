import React from 'react';
import { useTranslation } from 'react-i18next';

import { Badge } from './ui/Badge';
import { DeliveryStatus } from '@/types/Delivery';

interface StatusPillProps {
  status: DeliveryStatus;
}

const getStatusKey = (status: DeliveryStatus): string => {
  switch (status) {
    case DeliveryStatus.Pending:
      return 'deliveries.status.pending';
    case DeliveryStatus.InProgress:
      return 'deliveries.status.inProgress';
    case DeliveryStatus.Delivered:
      return 'deliveries.status.delivered';
  }
};

const getVariant = (status: DeliveryStatus) => {
  switch (status) {
    case DeliveryStatus.Pending:
      return 'warning' as const;
    case DeliveryStatus.InProgress:
      return 'info' as const;
    case DeliveryStatus.Delivered:
      return 'success' as const;
  }
};

export const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  const { t } = useTranslation();
  return <Badge label={t(getStatusKey(status))} variant={getVariant(status)} />;
};
