type OrderTestLike = {
  status?: string | null;
  result?: unknown;
};

type OrderLike = {
  status?: string | null;
  orderTests?: OrderTestLike[] | null;
};

export type OrderWorkflowStage =
  | 'ASSIGNED'
  | 'ON_THE_WAY'
  | 'SAMPLER_COLLECTED'
  | 'DELIVERED_TO_LAB'
  | 'RESULTS_READY'
  | 'CANCELLED';

function getTestStage(test: OrderTestLike): OrderWorkflowStage | 'AWAITING_SAMPLE' {
  if (test?.result || test?.status === 'COMPLETED') {
    return 'RESULTS_READY';
  }

  switch (test?.status) {
    case 'PROCESSING':
      return 'DELIVERED_TO_LAB';
    case 'COLLECTED':
      return 'SAMPLER_COLLECTED';
    default:
      return 'AWAITING_SAMPLE';
  }
}

export function getOrderWorkflowStage(order: OrderLike): OrderWorkflowStage {
  if (order?.status === 'CANCELLED') {
    return 'CANCELLED';
  }

  const tests = Array.isArray(order?.orderTests) ? order.orderTests : [];
  const testStages = tests.map(getTestStage);

  if (testStages.includes('RESULTS_READY')) {
    return 'RESULTS_READY';
  }

  if (testStages.includes('DELIVERED_TO_LAB')) {
    return 'DELIVERED_TO_LAB';
  }

  if (testStages.includes('SAMPLER_COLLECTED') || order?.status === 'COMPLETED') {
    return 'SAMPLER_COLLECTED';
  }

  if (order?.status === 'IN_PROGRESS') {
    return 'ON_THE_WAY';
  }

  return 'ASSIGNED';
}
