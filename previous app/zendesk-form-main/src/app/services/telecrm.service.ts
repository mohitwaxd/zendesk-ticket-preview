import { Injectable } from '@angular/core';
import axios from 'axios';
import type { Enterprise, User } from '../types';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class TelecrmService {
  constructor() {}

  async getTeamMembers(enterpriseId: string): Promise<User[] | null> {
    let customerTeamMembers: User[] | null = null;

    try {
      const response = await axios.get(
        `${environment.serverUrl}/enterprise/${enterpriseId}/license-response-schema`,
        {
        headers: {
          Authorization: environment.telecrmApiKey,
           "ngrok-skip-browser-warning": "6.x",
        },
        },
      );

      if(response.data?.teamMembers) {
        customerTeamMembers = response.data?.teamMembers;
      }
    } catch (error) {
      console.error("Error fetching team members for enterprise: ", enterpriseId, error);
    }

    if(customerTeamMembers) {
      customerTeamMembers = customerTeamMembers.map((member) => ({
        id: member.id,
        name: member.name,
        email: member.email,
        photoUrl: member.photoUrl,
        role: member.role,
      }));
    }

    return customerTeamMembers;
  }

  async getEnterprise(enterpriseId: string): Promise<Enterprise | null> {
    let enterprise: Enterprise | null = null;

    try {
      const response = await axios.get(
        `${environment.serverUrl}/enterprise/${enterpriseId}`,
        {
        headers: {
          Authorization: environment.telecrmApiKey,
          "ngrok-skip-browser-warning": "6.x",
        },
      },
    );

      if(response.data) {
        enterprise = response.data;
      }
    } catch (error) {
      console.error("Error fetching enterprise: ", enterpriseId, error);
    }

    return enterprise;
  }
}
