import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Params } from '@angular/router';

import type { DropdownOption, Enterprise, User } from './types';
import { TICKET_CREATORS, CUSTOMER_SUCCESS_TEAM_MEMBERS } from './constants/data'; 

import { DropdownComponent } from './components/dropdown/dropdown.component';
import { ButtonComponent } from './components/button/button.component';
import { MultiSelectDropdownComponent } from './components/multi-select-dropdown/multi-select-dropdown.component';

import { TelecrmService } from './services/telecrm.service';
import { extractArrayFromString, generateJWT } from './utils';
import { environment } from '../environments/environment.development';

declare global {
  interface Window {
    initialQueryParams: URLSearchParams;
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DropdownComponent, ButtonComponent, MultiSelectDropdownComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit {
  @ViewChild('jwtForm') jwtForm!: ElementRef<HTMLFormElement>;
  @ViewChild('jwtInput') jwtInput!: ElementRef<HTMLInputElement>;

  telecrmService = inject(TelecrmService);
  
  title = 'zendesk-redirect';
  returnToUrl: string = '';   

  enterprises: DropdownOption[] = []

  ticketCreatorName: string = '';
  ticketCreatorEmail: string = '';
  enterpriseIds: string[] = [];
  rootUserEmail: string = '';
  ticketCreators: DropdownOption[] = TICKET_CREATORS.map(member => ({
    id: member.id,
    name: member.email
  }));
  customerTeamMembers: User[] = [];
  customerSuccessTeamMembers: User[] = CUSTOMER_SUCCESS_TEAM_MEMBERS;

  selectedEnterprise: DropdownOption | null = null;
  selectedTicketCreator: DropdownOption = {
    id: '0',
    name: 'ahmad@telecrm.in',
  };
  selectedTeamMembers: User[] = [];
  selectedCustomerSuccessTeamMembers: User[] = [];

  createTicketMode: boolean = false;
  
  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(async (params) => {
      if (Object.keys(params).length === 0 && window.initialQueryParams) {
        const savedParams = Object.fromEntries(window.initialQueryParams);
        await this.handleQueryParams(savedParams);
      } else {
        await this.handleQueryParams(params);
      }
    });
  }

  private async handleQueryParams(params: Params): Promise<void> {
    this.enterpriseIds = extractArrayFromString(params['enterpriseIds']);
    this.ticketCreatorName = params['myName'] || 'Mohd Ahmad';
    this.ticketCreatorEmail = params['myEmail'] || 'ahmad@telecrm.in';
    
    this.selectedTicketCreator = {
        id: this.ticketCreatorEmail,
        name: this.ticketCreatorName,
    }

    await this.initializeData();
  }

  private async fetchTeamMembers(enterpriseId: string | undefined): Promise<User[] | null> {
    let members: User[] | null = null;
    
    if(enterpriseId) {
      members = await this.telecrmService.getTeamMembers(enterpriseId)
    }
    
    return members;
  }

  private async fetchEnterprise(enterpriseId: string): Promise<Enterprise | null> {
    const enterprise = await this.telecrmService.getEnterprise(enterpriseId);
    return enterprise;
  }

  private async initializeData(): Promise<void> {
    // TODO: Show loading state in UI until data is fetched
    for(const id of this.enterpriseIds) {
      const enterprise = await this.fetchEnterprise(id);
      
      if(enterprise) {
        this.enterprises.push({
          id,
          name: enterprise.name
        });
      }
    }

    if(this.enterprises.length === 1) {
      this.onEnterpriseSelected(this.enterprises[0]);
    }

    const foundTicketCreator = this.ticketCreators.find(
      ticket_creator => ticket_creator.id === this.ticketCreatorEmail
    );

    if(foundTicketCreator) {
      this.selectedTicketCreator = foundTicketCreator;
    }

    const copartner = this.getCopartnerEmail(this.selectedTicketCreator);
    if(copartner) {
      this.selectedCustomerSuccessTeamMembers = [copartner];
    }
  }
  
  private getCopartnerEmail(ticketCreator: DropdownOption): User | null {
    let copartner = null;
    const ticketCretor = TICKET_CREATORS.find(creator => creator.email === ticketCreator.id);

    if(ticketCretor && ticketCretor.coPartnerName && ticketCretor.coPartnerEmail) {
      copartner = {
        id: ticketCretor.coPartnerName,
        name: ticketCretor.coPartnerName,
        email: ticketCretor.coPartnerEmail,
      };
    }

    return copartner;
  }

  private async submitJwtForm(redirectTo: string) {
    const token = await generateJWT(this.ticketCreatorName, this.ticketCreatorEmail);
    this.jwtInput.nativeElement.value = token;
    
    const encodedReturnTo = encodeURIComponent(redirectTo);
    const url = `${environment.zendeskUrl}/access/jwt?return_to=${encodedReturnTo}`;
    this.jwtForm.nativeElement.action = url;
    this.jwtForm.nativeElement.submit();
  }

  onEnterpriseSelected(enterprise: DropdownOption): void {
    this.selectedEnterprise = enterprise;
  }

  onTicketCreatorSelected(ticketCreator: DropdownOption): void {
    this.selectedTicketCreator = ticketCreator;

    const copartner = this.getCopartnerEmail(ticketCreator);

    if(copartner) {
      this.selectedCustomerSuccessTeamMembers.push(copartner);
    }
  }

  onCustomerTeamMembersChange(selectedTeamMembers: User[]): void {
    this.selectedTeamMembers = selectedTeamMembers;
  }

  onCSTeamMembersChange(selectedCustomerSuccessTeamMembers: User[]): void {
    this.selectedCustomerSuccessTeamMembers = selectedCustomerSuccessTeamMembers;
  }

  async onCreateTicketMode(): Promise<void> {
    this.createTicketMode = true;

    // TODO: Show loading state in UI, either in dropdown or in whole section
    const customerTeamMembers = await this.fetchTeamMembers(this.selectedEnterprise?.id); 
    this.customerTeamMembers = customerTeamMembers || [];

    const rootUserEmail = customerTeamMembers?.find(member => member.role === 'ROOT')?.email;
    if(rootUserEmail) {
      this.rootUserEmail = rootUserEmail;

      this.selectedTeamMembers = [{
        id: "0",
        name: rootUserEmail,
        email: rootUserEmail,
        role: 'ROOT',
      }];
    }
  }

  resetCreateTicketMode(): void {
    this.createTicketMode = false;
    this.selectedTeamMembers = [];
    this.selectedCustomerSuccessTeamMembers = [
      {
        id: "0",
        name: this.rootUserEmail,
        email: this.rootUserEmail,
        role: 'ROOT',
      }
    ];
  }
  
  onCancel(): void {
    this.createTicketMode = false;
    this.resetCreateTicketMode();
  }

  async onViewTickets(): Promise<void> {
    this.returnToUrl = `${environment.zendeskUrl}/hc/en-us/requests?query=&page=1&selected_tab_name=my-requests&filter_custom_field_26502721658141=%3A"${this.selectedEnterprise?.id}"`;

    await this.submitJwtForm(this.returnToUrl);
  }
  
  async createTicket(): Promise<void> {
    this.returnToUrl = `${environment.zendeskUrl}/hc/en-us/requests/new?tf_26502721658141=${this.selectedEnterprise?.id}&tf_26396049864093=${this.selectedEnterprise?.name}&tf_26557184334237=${this.selectedTicketCreator?.id}`;

    const selectedTeamMembersEmails = this.selectedTeamMembers.map(member => member.email);
    const selectedCustomerSuccessTeamMembersEmails = this.selectedCustomerSuccessTeamMembers.map(member => member.email);
    const cc_emails = [...new Set(['support@telecrm.in', 'ahmad@telecrm.in', 'ramsha.farooq@telecrm.in', 'mohit@telecrm.in', ...selectedTeamMembersEmails, ...selectedCustomerSuccessTeamMembersEmails])];
    
    if(cc_emails.length > 0) {
      this.returnToUrl += `&tf_collaborators=${cc_emails.join(',')}`;
    }
    
    await this.submitJwtForm(this.returnToUrl);

    this.resetCreateTicketMode();
  }
}
