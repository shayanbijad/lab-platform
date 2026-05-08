const STAGE_BADGE_CLASSES = {
  ASSIGNED: "bg-sky-100 text-sky-700",
  ON_THE_WAY: "bg-violet-100 text-violet-700",
  SAMPLER_COLLECTED: "bg-amber-100 text-amber-700",
  DELIVERED_TO_LAB: "bg-indigo-100 text-indigo-700",
  RESULTS_READY: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-rose-100 text-rose-700",
};

function getMissionStatus(order, missionStatus) {
  if (missionStatus) {
    return missionStatus;
  }

  return Array.isArray(order?.missions) ? order.missions[0]?.status : undefined;
}

export function getTestWorkflowStage(test) {
  if (test?.result || test?.status === "COMPLETED") {
    return "RESULTS_READY";
  }

  switch (test?.status) {
    case "PROCESSING":
      return "DELIVERED_TO_LAB";
    case "COLLECTED":
      return "SAMPLER_COLLECTED";
    default:
      return "AWAITING_SAMPLE";
  }
}

export function getTestStatusLabel(test) {
  switch (getTestWorkflowStage(test)) {
    case "RESULTS_READY":
      return "نتیجه آماده است";
    case "DELIVERED_TO_LAB":
      return "به آزمایشگاه تحویل شد";
    case "SAMPLER_COLLECTED":
      return "نمونه جمع‌آوری شد";
    default:
      return "در انتظار نمونه‌گیری";
  }
}

export function getOrderWorkflowStage(order, options = {}) {
  if (!order) {
    return "ASSIGNED";
  }

  if (order.status === "CANCELLED") {
    return "CANCELLED";
  }

  const tests = Array.isArray(order.orderTests) ? order.orderTests : [];
  const testStages = tests.map(getTestWorkflowStage);
  const activeMissionStatus = getMissionStatus(order, options.missionStatus);

  if (testStages.includes("RESULTS_READY")) {
    return "RESULTS_READY";
  }

  if (testStages.includes("DELIVERED_TO_LAB")) {
    return "DELIVERED_TO_LAB";
  }

  if (
    activeMissionStatus === "COLLECTED" ||
    testStages.includes("SAMPLER_COLLECTED") ||
    order.status === "COMPLETED"
  ) {
    return "SAMPLER_COLLECTED";
  }

  if (order.status === "IN_PROGRESS") {
    return "ON_THE_WAY";
  }

  return "ASSIGNED";
}

export function getOrderStatusLabel(order, options = {}) {
  const audience = options.audience === "doctor" ? "doctor" : "sampler";

  switch (getOrderWorkflowStage(order, options)) {
    case "ASSIGNED":
      return audience === "doctor" ? "پزشک تخصیص داده شد" : "نمونه‌گیر تخصیص داده شد";
    case "ON_THE_WAY":
      return audience === "doctor" ? "پزشک در مسیر است" : "نمونه‌گیر در مسیر است";
    case "SAMPLER_COLLECTED":
      return "نمونه جمع‌آوری شد";
    case "DELIVERED_TO_LAB":
      return "به آزمایشگاه تحویل شد";
    case "RESULTS_READY":
      return "نتیجه آماده است";
    case "CANCELLED":
      return "لغو شده";
    default:
      return "نامشخص";
  }
}

export function getOrderStatusBadgeClass(order, options = {}) {
  return STAGE_BADGE_CLASSES[getOrderWorkflowStage(order, options)] || "bg-slate-100 text-slate-700";
}

export function getOrderProgressStep(order, options = {}) {
  const steps = {
    ASSIGNED: 0,
    ON_THE_WAY: 1,
    SAMPLER_COLLECTED: 2,
    DELIVERED_TO_LAB: 3,
    RESULTS_READY: 4,
    CANCELLED: 0,
  };

  return steps[getOrderWorkflowStage(order, options)] ?? 0;
}

export function isOrderResultsReady(order, options = {}) {
  return getOrderWorkflowStage(order, options) === "RESULTS_READY";
}

export function isOrderClosed(order, options = {}) {
  const stage = getOrderWorkflowStage(order, options);
  return stage === "RESULTS_READY" || stage === "CANCELLED";
}

export function getInternalOrderStatusLabel(status, options = {}) {
  const audience = options.audience === "doctor" ? "doctor" : "sampler";

  switch (status) {
    case "CREATED":
      return "در انتظار تخصیص";
    case "SCHEDULED":
      return audience === "doctor" ? "پزشک تخصیص داده شد" : "نمونه‌گیر تخصیص داده شد";
    case "IN_PROGRESS":
      return audience === "doctor" ? "پزشک در مسیر است" : "نمونه‌گیر در مسیر است";
    case "COMPLETED":
      return "نمونه جمع‌آوری شد";
    case "CANCELLED":
      return "لغو شده";
    default:
      return status || "نامشخص";
  }
}
