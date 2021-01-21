using System.Threading.Tasks;
using System.Threading;
using MediatR;
using Persistence;
using System;
using Application.Errors;
using System.Net;

namespace Application.Activities
{
    public class Delete
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
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

                context.Activities.Remove(a);

                var success = await context.SaveChangesAsync() > 0;
                if (success)
                    return Unit.Value;
                else
                    throw new Exception("Problem saving changes");
            }
        }
    }
}