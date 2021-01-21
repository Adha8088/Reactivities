using System.Threading.Tasks;
using System.Threading;
using MediatR;
using FluentValidation;

using Domain;
using Persistence;
using System;

namespace Application.Activities
{
    public class Create
    {

        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Title { get; set; }
            public string Category { get; set; }
            public string Description { get; set; }
            public DateTime Date { get; set; }
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
                var a = new Activity
                {
                    Id = request.Id,
                    Description = request.Description,
                    Category = request.Category,
                    Date = request.Date,
                    Venue = request.Venue,
                    City = request.City,
                    Title = request.Title
                };

                context.Activities.Add(a);
                var success = await context.SaveChangesAsync() > 0;
                if (success)
                    return Unit.Value;
                else
                    throw new Exception("Problem saving changes");
            }
        }


    }
}