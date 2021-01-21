using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Title { get; set; }
            public string Category { get; set; }
            public string Description { get; set; }
            public DateTime? Date { get; set; }
            public string City { get; set; }
            public string Venue { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(X => X.Title).NotEmpty();
                RuleFor(X => X.Description).NotEmpty();
                RuleFor(X => X.Date).NotEmpty();
                RuleFor(X => X.Venue).NotEmpty();
                RuleFor(X => X.City).NotEmpty();
                RuleFor(X => X.Category).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext context;

            public Handler(DataContext context)
            {
                this.context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var a = await context.Activities.FindAsync(request.Id);
                if (a == null)
                    throw new RestException(HttpStatusCode.NotFound, new { activity = "Not found" });

                a.Description = request.Description ?? a.Description;
                a.Category = request.Category ?? a.Category;
                a.Date = request.Date ?? a.Date;
                a.Venue = request.Venue ?? a.Venue;
                a.City = request.City ?? a.City;
                a.Title = request.Title ?? a.Title;

                var success = await context.SaveChangesAsync() > 0;
                if (success)
                    return Unit.Value;
                else
                    throw new Exception("Problem saving changes");
            }

        }
    }
}