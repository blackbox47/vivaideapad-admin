import { useCreateAdjustmentMutation } from '@/services/rewards/rewards-service';

export default function useCreateAdjustment() {
  return useCreateAdjustmentMutation();
}
