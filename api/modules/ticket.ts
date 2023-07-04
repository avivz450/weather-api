export class Ticket {
  id: string;
  title: string;
  content: string;
  userEmail: string;
  creationTime: {};
  labels: string[];
  static PAGE_SIZE: number = 10;

  constructor(ticket?: Partial<Ticket>) {
    if (ticket) {
      this.id = ticket.id;
      this.title = ticket.title;
      this.content = ticket.content;
      this.userEmail = ticket.userEmail;
      this.creationTime = ticket.creationTime;
      this.labels = ticket.labels;
    }
  }
}
