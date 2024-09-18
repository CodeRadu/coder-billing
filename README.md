# Coder Billing

Coder Billing is a billing system designed to manage and automate the billing process in a [Coder](https://coder.com) environment.

## Features

- **Billing Automation**: Automatically calculates and charges users based on their workspace usage.
- **Template Management**: Manage Coder templates and set pricing for each resource.

## Getting Started

### Prerequisites

- Docker
- Docker Compose
- A Coder environment
- A Stripe account (test mode or not)

### Installation

1. Write a `docker-compose.yml` file with the following content:

```yaml
services:
  coder-billing:
    image: ghcr.io/CodeRadu/coder-billing:latest
    environment:
      - NEXTAUTH_URL=<the URL where Coder Billing is hosted>
      - NEXTAUTH_SECRET=<a random string>
      - DATABASE_URL=<postgresql connection string>
      - CODER_URL=<the URL of your Coder environment>
      - CODER_API_KEY=<an administrator API key generated from Coder>
      - STRIPE_PUBLISHABLE_KEY=<your Stripe public key>
      - STRIPE_SECRET_KEY=<your Stripe secret key>
      - STRIPE_SIGNING_SECRET=<your Stripe signing secret>
    ports:
      - 3000:3000
```

2. Run `docker-compose up -d` to start the Coder Billing service.

3. Access Coder Billing to finish the setup process.

4. Get paid! 💸
