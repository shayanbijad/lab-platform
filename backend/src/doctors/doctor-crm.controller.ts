import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { getOrderWorkflowStage } from '../orders/order-status.util';

@Controller('doctor-crm')
export class DoctorCrmController {
  constructor(private prisma: PrismaService) {}

  /**
   * GET /doctor-crm/patients
   * Returns all patients with their orders, for the doctor's CRM dashboard.
   */
  @Get('patients')
  async getAllPatients() {
    const patients = await this.prisma.patient.findMany({
      include: {
        user: {
          select: { id: true, phone: true, email: true },
        },
        addresses: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        orders: {
          include: {
            orderTests: {
              include: {
                labTest: true,
                result: true,
              },
            },
            address: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return patients;
  }

  /**
   * GET /doctor-crm/orders
   * Returns all orders with full patient and test info.
   */
  @Get('orders')
  async getAllOrders() {
    const orders = await this.prisma.order.findMany({
      include: {
        patient: {
          include: {
            user: {
              select: { id: true, phone: true, email: true },
            },
          },
        },
        orderTests: {
          include: {
            labTest: true,
            result: true,
          },
        },
        address: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders;
  }

  /**
   * GET /doctor-crm/stats
   * Returns aggregate statistics for the doctor dashboard.
   */
  @Get('stats')
  async getStats() {
    const totalPatients = await this.prisma.patient.count();
    const orders = await this.prisma.order.findMany({
      include: {
        orderTests: {
          include: {
            result: true,
          },
        },
      },
    });

    const totalOrders = orders.length;
    const pendingOrders = orders.filter((order) => getOrderWorkflowStage(order) === 'ASSIGNED').length;
    const inProgressOrders = orders.filter(
      (order) => getOrderWorkflowStage(order) === 'ON_THE_WAY',
    ).length;
    const completedOrders = orders.filter(
      (order) => getOrderWorkflowStage(order) === 'RESULTS_READY',
    ).length;

    const recentOrders = await this.prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        patient: {
          select: { firstName: true, lastName: true },
        },
        orderTests: {
          include: {
            result: true,
          },
        },
      },
    });

    return {
      totalPatients,
      totalOrders,
      pendingOrders,
      inProgressOrders,
      completedOrders,
      recentOrders,
    };
  }
}
